import { projects } from "@/data/projects";
import { FadeIn } from "@/components/ui/FadeIn";
import { TextLink } from "@/components/ui/Links";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FlagshipProject } from "@/components/work/FlagshipProject";
import { ProjectRow } from "@/components/work/ProjectRow";

export function SelectedWork() {
  const flagship = projects.filter((p) => p.tier === "flagship");
  const list = projects.filter((p) => p.tier === "list");

  return (
    <section id="work" aria-labelledby="work-title" className="wrap pb-28">
      <SectionHeader
        id="work-title"
        index="01"
        label="Selected work"
        title="Products running in the real world."
        action={
          <TextLink href="/work" icon="arrow">
            All projects
          </TextLink>
        }
      />

      <div className="mt-16 flex flex-col gap-24">
        {flagship.map((project, i) => (
          <FadeIn key={project.slug}>
            <FlagshipProject project={project} index={i} />
          </FadeIn>
        ))}
      </div>

      {list.length > 0 && (
        <FadeIn className="mt-20">
          <p className="font-mono text-xs tracking-[0.06em] text-muted">MORE WORK</p>
          <ul className="mt-4 border-t border-line">
            {list.map((project, i) => (
              <ProjectRow key={project.slug} project={project} number={flagship.length + i + 1} />
            ))}
          </ul>
        </FadeIn>
      )}
    </section>
  );
}