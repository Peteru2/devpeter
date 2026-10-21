import Link from "next/link";
import { nowItems, nowUpdated, type NowStatus } from "@/data/now";
import { FadeIn } from "@/components/ui/FadeIn";
import { PanelHeading } from "./PanelHeading";

const columns: { status: NowStatus; label: string; dot: string }[] = [
  { status: "now", label: "Now", dot: "bg-accent" },
  { status: "next", label: "Next", dot: "bg-muted" },
  { status: "shipped", label: "Shipped", dot: "bg-live" },
];

export function NowPanel() {
  return (
    <div>
      <PanelHeading
        title="What I’m working on."
        intro="A live look at what I’m building, learning and writing."
        action={<p className="font-mono text-xs text-muted">Last updated · {nowUpdated}</p>}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {columns.map((col, c) => {
          const items = nowItems.filter((i) => i.status === col.status);
          return (
            <FadeIn key={col.status} delay={c * 0.06}>
              <section aria-labelledby={`now-${col.status}`} className="h-full rounded-2xl border border-line p-4 sm:p-5">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <h3 id={`now-${col.status}`} className="flex items-center gap-2.5 text-[15px] font-medium">
                    <span aria-hidden="true" className={`size-[7px] rounded-full ${col.dot}`} />
                    {col.label}
                  </h3>
                  <span className="font-mono text-xs text-muted">{String(items.length).padStart(2, "0")}</span>
                </div>

                <ul className="mt-4 space-y-3">
                  {items.map((item) => {
                    const body = (
                      <>
                        <span className="inline-block rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">
                          {item.tag}
                        </span>
                        <span className="mt-2.5 block text-[15px] font-medium leading-snug">
                          {item.title}
                          {item.href && <span aria-hidden="true"> →</span>}
                        </span>
                        {item.note && <span className="mt-1 block text-sm text-muted">{item.note}</span>}
                      </>
                    );
                    return (
                      <li key={item.title}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="block rounded-xl bg-panel p-4 transition-colors hover:bg-tint"
                          >
                            {body}
                          </Link>
                        ) : (
                          <div className="rounded-xl bg-panel p-4">{body}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}