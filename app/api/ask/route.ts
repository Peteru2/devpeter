import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { Resend } from "resend";
import { getSystemPrompt } from "@/lib/askKnowlegde";

/* Pick the AI provider with AI_PROVIDER=groq (default) or AI_PROVIDER=gemini */
const PROVIDER = process.env.AI_PROVIDER === "gemini" ? "gemini" : "groq";

function getModel() {
  if (PROVIDER === "gemini") return google(process.env.GEMINI_MODEL || "gemini-3.8-flash");
  return groq(process.env.GROQ_MODEL || "openai/gpt-oss-120b");
}

const hasKey = () =>
  PROVIDER === "gemini" ? !!process.env.GOOGLE_GENERATIVE_AI_API_KEY : !!process.env.GROQ_API_KEY;

const MAX_CHARS = 500; // per message
const MAX_MESSAGES = 20; // per conversation (10 questions + 10 answers)
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 20; // per visitor per window

// Best-effort limiter. Serverless instances restart, so this slows abuse rather than
// stopping it completely.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

function textOf(message: UIMessage): string {
  return message.parts.map((p) => (p.type === "text" ? p.text : "")).join("").trim();
}

/* Keep only plain user/assistant text, so nothing unexpected reaches the model */
function sanitize(raw: unknown): UIMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null;
  const clean: UIMessage[] = [];
  for (const m of raw as UIMessage[]) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || !Array.isArray(m.parts)) return null;
    const text = textOf(m);
    if (m.role === "user" && (!text || text.length > MAX_CHARS)) return null;
    clean.push({ id: String(m.id ?? ""), role: m.role, parts: [{ type: "text", text: text.slice(0, 2000) }] });
  }
  return clean[clean.length - 1]?.role === "user" ? clean : null;
}

async function logQuestion(question: string, answer: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (process.env.ASK_LOG_EMAIL === "off" || !apiKey || !to) return;
  try {
    await new Resend(apiKey).emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to,
      subject: `Ask Peter: ${question.slice(0, 70)}`,
      text: `Someone asked:\n${question}\n\nAsk Peter answered:\n${answer}`,
    });
  } catch {
    // Never let logging break the chat
  }
}

export async function POST(req: Request) {
  if (!hasKey()) {
    return new Response("Ask Peter isn’t set up yet.", { status: 503 });
  }

  const ip =
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (rateLimited(ip)) {
    return new Response("You’ve asked a lot of questions. Please try again in a few minutes.", { status: 429 });
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const messages = sanitize(body.messages);
  if (!messages) return new Response("Bad request", { status: 400 });
  const question = textOf(messages[messages.length - 1]);

  const result = streamText({
    model: getModel(),
    system: getSystemPrompt(),
    messages: await convertToModelMessages(messages),
    temperature: 0.3,
    maxOutputTokens: 1500,
    maxRetries: 4,
    onFinish: async ({ text }) => {
      await logQuestion(question, text);
    },
  });

  return result.toUIMessageStreamResponse({
    onError: () => "Sorry, I couldn’t answer that just now. Please try again, or use the contact form.",
  });
}