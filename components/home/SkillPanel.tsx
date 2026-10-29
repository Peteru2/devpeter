import { stackGroups } from "@/data/stack";
import { softSkills } from "@/data/skills";
import { projects } from "@/data/projects";
import { StackExplorer, type StackUse } from "./StackExplorer";
import { FadeIn } from "@/components/ui/FadeIn";
import { PanelHeading } from "./PanelHeading";

// "MongoDB (Mongoose)" -> "mongodb", "JWT auth" -> "jwt", so project stacks and the toolbox line up
const norm = (s: string) => s.toLowerCase().replace(/\s*\(.*\)/, "").replace(/\s+auth$/, "").trim();

function stackUsage(): Record<string, StackUse[]> {
  const usage: Record<string, StackUse[]> = {};
  for (const item of stackGroups.flatMap((g) => g.items)) {
    usage[item] = projects
      .filter((p) => p.tier !== "archive" && (p.fullStack ?? p.stack).some((t) => norm(t) === norm(item)))
      .map((p) => ({ name: p.name, slug: p.slug, hasCaseStudy: p.hasCaseStudy }));
  }
  return usage;
}

export function SkillsPanel() {
  return (
    <div>
      <PanelHeading
        title="What I build with, and how I work with people."
        intro="Every tool here has been used in production. Every skill comes with proof."
      />

      <FadeIn className="mt-12">
        <h3 className="font-mono text-xs tracking-[0.06em] text-muted">TECHNICAL</h3>
        <div className="mt-3">
          <StackExplorer groups={stackGroups.map((g) => ({ label: g.label, items: g.items }))} usage={stackUsage()} />
        </div>
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