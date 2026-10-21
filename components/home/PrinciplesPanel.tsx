import { principles } from "@/data/principles";
import { FadeIn } from "@/components/ui/FadeIn";
import { PanelHeading } from "./PanelHeading";

export function PrinciplesPanel() {
  return (
    <div>
      <PanelHeading title="Principles I bring to every project." />
      <ol className="mt-12 grid gap-x-16 gap-y-12 sm:grid-cols-2">
        {principles.map((p, i) => (
          <li key={p.title}>
            <FadeIn delay={(i % 2) * 0.08} className="border-t border-line pt-6">
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-serif text-[28px] leading-tight">{p.title}</h3>
              <p className="mt-3 max-w-[460px] leading-relaxed text-muted">{p.body}</p>
            </FadeIn>
          </li>
        ))}
      </ol>
    </div>
  );
}