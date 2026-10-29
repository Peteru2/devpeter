"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked: the mailto link above still works.
    }
  };

  return (
    <div className="mt-8">
      <a
        href={`mailto:${email}`}
        className="inline-block break-all border-b border-line pb-1 font-serif text-[28px] leading-tight transition-colors hover:border-ink"
      >
        {email}
      </a>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm transition-colors hover:border-ink"
        >
          <Icon name={copied ? "check" : "arrow"} className="size-3.5" />
          {copied ? "Copied" : "Copy email"}
        </button>
        <span role="status" className="sr-only">
          {copied ? "Email address copied to clipboard" : ""}
        </span>
      </div>
    </div>
  );
}
