"use client";

import { useState } from "react";
import Link from "next/link";

export type StackUse = { name: string; slug: string; hasCaseStudy: boolean };
export type StackGroupView = { label: string; items: string[] };

/** Tools are clickable when they appear in a featured project; selecting one shows where it was used. */
export function StackExplorer({ groups, usage }: { groups: StackGroupView[]; usage: Record<string, StackUse[]> }) {
  const [picked, setPicked] = useState<string | null>(null);
  const uses = picked ? usage[picked] ?? [] : [];

  return (
    <div>
      <dl className="border-t border-line">
        {groups.map((g) => (
          <div key={g.label} className="flex flex-col gap-3 border-b border-line py-4 sm:flex-row sm:gap-4">
            <dt className="w-28 shrink-0 pt-1.5 font-mono text-xs text-muted">{g.label}</dt>
            <dd className="flex flex-wrap gap-2">
              {g.items.map((item) =>
                usage[item]?.length ? (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={picked === item}
                    onClick={() => setPicked((cur) => (cur === item ? null : item))}
                    className={`min-h-9 rounded-full border px-3.5 font-mono text-[12.5px] transition-colors ${
                      picked === item ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"
                    }`}
                  >
                    {item}
                  </button>
                ) : (
                  <span key={item} className="inline-flex min-h-9 items-center px-1.5 font-mono text-[12.5px] text-muted">
                    {item}
                  </span>
                )
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div aria-live="polite" className="mt-5 min-h-[3.25rem] rounded-xl bg-panel px-4 py-3.5 text-[15px]">
        {picked ? (
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-medium">{picked}</span> {" "}
            <span className="text-muted">in production at</span> {" "}
            {uses.map((u, i) => (
              <span key={u.slug}>
                {u.hasCaseStudy ? (
                  <Link href={`/work/${u.slug}`} className="underline decoration-line underline-offset-4 hover:decoration-ink">
                    {u.name}
                  </Link>
                ) : (
                  u.name
                )}
                {i < uses.length - 1 && <span className="text-muted">,</span>}
              </span>
            ))}
          </p>
        ) : (
          <p className="text-muted">Select a highlighted tool to see where I’ve used it in production.</p>
        )}
      </div>
    </div>
  );
}
