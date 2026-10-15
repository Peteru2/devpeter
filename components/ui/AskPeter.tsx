"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./Icon";

const transport = new DefaultChatTransport({ api: "/api/ask" });

const suggestions = [
  "What is Peter working on?",
  "Is he open to work?",
  "What’s his tech stack?",
  "How does Buydair handle failed payments?",
];

const MAX_CHARS = 500;
const MAX_QUESTIONS = 10;

const textOf = (m: UIMessage) => m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

export function AskPeter() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

    const { messages, sendMessage, status, error, stop } = useChat({ id: "ask-peter", transport });

  const busy = status === "submitted" || status === "streaming";
  const asked = messages.filter((m) => m.role === "user").length;
  const limitReached = asked >= MAX_QUESTIONS;

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || busy || limitReached) return;
    sendMessage({ text: q.slice(0, MAX_CHARS) });
    setInput("");
  };

  // Focus the input when opening; Escape closes
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest message in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-labelledby="ask-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 bottom-3 z-[60] flex max-h-[min(640px,calc(100dvh-24px))] flex-col overflow-hidden rounded-[20px] border border-line bg-bg shadow-[0_30px_80px_-20px_rgb(15_17_21/0.45)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <h2 id="ask-title" className="font-serif text-2xl leading-none">
                  Ask Peter
                </h2>
                <p className="mt-1.5 font-mono text-[11px] text-muted">AI assistant · answers from this site</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Ask Peter"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-muted hover:border-ink hover:text-ink"
              >
                <Icon name="close" className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} aria-live="polite" className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.length === 0 ? (
                <div>
                  <p className="text-[15px] leading-relaxed text-muted">
                    Hi! Ask me anything about Peter’s work, skills or availability.
                  </p>
                  <div className="mt-4 flex flex-col items-start gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => ask(s)}
                        className="min-h-10 rounded-full border border-line px-4 text-left text-sm transition-colors hover:border-ink"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) =>
                  m.role === "user" ? (
                    <p
                      key={m.id}
                      className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-[15px] text-bg"
                    >
                      {textOf(m)}
                    </p>
                  ) : (
                    <p key={m.id} className="max-w-[95%] whitespace-pre-wrap text-[15px] leading-relaxed">
                      {textOf(m)}
                    </p>
                  )
                )
              )}

              {status === "submitted" && <p className="font-mono text-xs text-muted">Thinking…</p>}

              {error && (
                <p className="text-sm text-danger">
                  Something went wrong. Please try again, or{" "}
                  <a href="/#contact" onClick={() => setOpen(false)} className="underline underline-offset-4">
                    send Peter a message
                  </a>
                  .
                </p>
              )}

              {limitReached && !busy && (
                <p className="text-sm text-muted">
                  That’s the limit for this chat. For anything else,{" "}
                  <a href="/#contact" onClick={() => setOpen(false)} className="text-ink underline underline-offset-4">
                    contact Peter directly
                  </a>
                  .
                </p>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="border-t border-line px-4 pb-3 pt-3"
            >
              <div className="flex items-end gap-2">
                <label htmlFor="ask-input" className="sr-only">
                  Your question
                </label>
                <textarea
                  id="ask-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_CHARS}
                  disabled={limitReached}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      ask(input);
                    }
                  }}
                  placeholder="Ask a question…"
                  className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-line bg-bg px-3.5 py-2.5 text-[15px] placeholder:text-muted/70 focus:border-ink focus:outline-none disabled:opacity-60"
                />
                {busy ? (
                  <button
                    type="button"
                    onClick={() => stop()}
                    aria-label="Stop answering"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line hover:border-ink"
                  >
                    <span className="size-3 rounded-[2px] bg-ink" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() || limitReached}
                    aria-label="Send question"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-bg transition-opacity disabled:opacity-40"
                  >
                    <Icon name="arrow" className="size-4 -rotate-90" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-[11.5px] leading-snug text-muted">
                AI answers based on this site, and can make mistakes. Questions are shared with Peter, so please don’t
                include personal or sensitive information.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-bg shadow-[0_16px_40px_-12px_rgb(15_17_21/0.5)] transition-opacity hover:opacity-90"
        >
          <Icon name="chat" className="size-[18px]" />
          Ask Peter
        </button>
      )}
    </>
  );
}