"use server";

import { Resend } from "resend";
import { z } from "zod";
import { contactNotification } from "@/lib/emails/contactNotification";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email address"),
  reason: z.enum(["job", "project", "other"]),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z
    .string()
    .trim()
    .min(20, "Tell me a little more (at least 20 characters)")
    .max(5000, "That’s a bit long. Please keep it under 5,000 characters"),
});

export type ContactField = "name" | "email" | "reason" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
};

const reasonLabels = { job: "Job opportunity", project: "Project", other: "Something else" } as const;

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Spam trap: real people never fill this hidden field
  if (formData.get("company")) return { status: "success", message: "Thanks! Your message is on its way." };

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    reason: formData.get("reason") || undefined,
    service: formData.get("service") || undefined,
    budget: formData.get("budget") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField;
      errors[key] ??= key === "reason" ? "Please choose what you’re reaching out about" : issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return { status: "error", message: "The form isn’t connected yet. Please email me directly instead." };
  }

  const d = parsed.data;
  const resend = new Resend(apiKey);
  const mail = contactNotification(d);

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to,
    replyTo: d.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });

  if (error) {
    return { status: "error", message: "Something went wrong sending your message. Please email me directly." };
  }

  return { status: "success", message: "Thanks! Your message is on its way, and I’ll get back to you soon." };
}