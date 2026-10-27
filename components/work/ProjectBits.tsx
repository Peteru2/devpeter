    import type { Project } from "@/data/projects";
    import { TextLink } from "@/components/ui/Links";

    export const hostOf = (url: string) => {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
    };

    export function StackLine({ items, className = "" }: { items: string[]; className?: string }) {
    if (!items.length) return null;
    return <p className={`font-mono text-[12.5px] leading-relaxed text-muted ${className}`}>{items.join(" · ")}</p>;
    }

    export function ProjectLinks({ project, className = "" }: { project: Project; className?: string }) {
    const { live, github } = project.links;


    if (!project.hasCaseStudy && !live && !github?.length) return null;
    return (
        <div className={`flex flex-wrap gap-x-6 gap-y-1 ${className}`}>
        {project.hasCaseStudy && (
            <TextLink href={`/work/${project.slug}`} icon="arrow">
            Read case study
            </TextLink>
        )}
        {live && (
            <TextLink href={live} icon="external" external>
            {hostOf(live)}
            </TextLink>
        )}
          
          {project.status && (
  <p className="inline-flex h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-[15px] font-medium text-bg">
    {project.status}
  </p>
)}

           
    
        {github?.map((g) => (
            <TextLink key={g.url} href={g.url} icon="external" external>
            {g.label} code
            </TextLink>
        ))}
        </div>
    );
    }