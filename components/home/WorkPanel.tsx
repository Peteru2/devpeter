import { projects } from "@/data/projects";
import { FadeIn } from "@/components/ui/FadeIn";
import { TextLink } from "@/components/ui/Links";
import { FlagshipProject } from "@/components/work/FlagshipProject";
import { ProjectRow } from "@/components/work/ProjectRow";
import { PanelHeading } from "./PanelHeading";

export function WorkPanel() {
  const flagship = projects.filter((p) => p.tier === "flagship");
  const list = projects.filter((p) => p.tier === "list");

  return (
    <div>
      <PanelHeading
        title="Products running in the real world."
        action={
          <TextLink href="/work" icon="arrow">
            All projects
          </TextLink>
        }
      />

      <div className="mt-14 flex flex-col gap-24">
        {flagship.map((project, i) => (
          <FadeIn key={project.slug}>
            <FlagshipProject project={project} index={i} />
          </FadeIn>
        ))}
      </div>

      {list.length > 0 && (
        <div className="mt-20">
          <p className="font-mono text-xs tracking-[0.06em] text-muted">MORE WORK</p>
          <ul className="mt-4 border-t border-line">
            {list.map((project, i) => (
              <ProjectRow key={project.slug} project={project} number={flagship.length + i + 1} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}