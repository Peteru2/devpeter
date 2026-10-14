import { principles } from "@/data/principles";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Principles() {
  return (
    <section id="how-i-work" aria-labelledby="how-title" className="wrap pb-28">
      <SectionHeader id="how-title" index="03" label="How I work" title="Principles I bring to every project." />
      <ol className="mt-14 grid gap-x-16 gap-y-12 sm:grid-cols-2">
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
    </section>
  );
}