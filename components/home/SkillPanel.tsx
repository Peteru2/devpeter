import { stackGroups } from "@/data/stack";
import { softSkills } from "@/data/skills";
import { FactList } from "@/components/ui/FactList";
import { FadeIn } from "@/components/ui/FadeIn";
import { PanelHeading } from "./PanelHeading";

export function SkillsPanel() {
  return (
    <div>
      <PanelHeading
        title="What I build with, and how I work with people."
        intro="Every tool here has been used in production. Every skill comes with proof."
      />

      <FadeIn className="mt-12">
        <h3 className="font-mono text-xs tracking-[0.06em] text-muted">TECHNICAL</h3>
        <FactList
          className="mt-3"
          items={stackGroups.map((g) => ({ label: g.label, value: g.items.join(" · ") }))}
        />
      </FadeIn>

      <div className="mt-14">
        <h3 className="font-mono text-xs tracking-[0.06em] text-muted">BEYOND THE CODE</h3>
        <div className="mt-6 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {softSkills.map((group, i) => (
            <FadeIn key={group.title} delay={(i % 3) * 0.06} className="border-t border-line pt-5">
              <h4 className="font-serif text-[24px] leading-tight">{group.title}</h4>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-muted" />
                    {item}
                  </li>
                ))}
              </ul>
              {group.proof && (
                <p className="mt-4 text-[14px] leading-relaxed">
                  <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-accent">Proof · </span>
                  {group.proof}
                </p>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}