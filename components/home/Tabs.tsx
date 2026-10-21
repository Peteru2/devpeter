"use client";

import { useEffect, useRef, useState } from "react";

export type TabDef = { id: string; label: string; content: React.ReactNode };

export function Tabs({ tabs, defaultId, label }: { tabs: TabDef[]; defaultId: string; label: string }) {
  const [active, setActive] = useState(defaultId);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const ids = tabs.map((t) => t.id).join(",");

  // Open the tab named in the link, e.g. /?tab=now#work
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("tab");
    if (requested && ids.split(",").includes(requested)) setActive(requested);
  }, [ids]);

  const select = (id: string, focus = false) => {
    setActive(id);
    const url = new URL(window.location.href);
    if (id === defaultId) url.searchParams.delete("tab");
    else url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    if (focus) refs.current[tabs.findIndex((t) => t.id === id)]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      select(tabs[next].id, true);
    }
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="-mx-5 flex gap-1 overflow-x-auto border-b border-line px-5 [scrollbar-width:none] sm:mx-0 sm:px-0"
      >
        {tabs.map((t, i) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`-mb-px min-h-12 shrink-0 border-b-2 px-4 text-[15px] transition-colors ${
                selected ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          id={`panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
          tabIndex={0}
          className="animate-[tab-in_0.35s_ease] pt-12 focus:outline-none"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}