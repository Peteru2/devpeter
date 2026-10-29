"use client";

import { openAskPeter } from "./AskPeter";

const questions = [
  "What has Peter built?",
  "How does Buydair handle failed payments?",
  "Is he open to work?",
];

/** Quick questions under the hero that open the Ask Peter assistant with the question already sent. */
export function AskChips() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="font-mono text-xs text-muted">Ask the assistant →</span>
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => openAskPeter(q)}
          className="min-h-10 rounded-full border border-line px-4 text-sm transition-colors hover:border-ink hover:bg-tint"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
