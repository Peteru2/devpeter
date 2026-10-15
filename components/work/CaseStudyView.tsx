import Link from "next/link";
import type { Project } from "@/data/projects";
import type { CaseStudy } from "@/data/caseStudies";
import { FactList } from "@/components/ui/FactList";
import { FadeIn } from "@/components/ui/FadeIn";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Links";
import { Shot } from "@/components/ui/Shot";
import { Architecture } from "./Architecture";
import { hostOf } from "./ProjectBits";

const phoneCls =
  "absolute w-[40%] max-w-[230px] overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_30px_60px_-30px_rgb(15_17_21/0.35)]";

function Phones({ project }: { project: Project }) {
  const [a, b] = project.images?.screens ?? [];
  return (
    <div className="relative h-[440px] overflow-hidden rounded-[20px] border border-line bg-panel sm:h-[560px]">
      <div className={`${phoneCls} left-[8%] top-10 sm:left-[16%]`}>
        <Shot src={a} alt={`${project.name} home screen`} label="Home screen" sizes="230px" className="aspect-[440/956]" />
      </div>
      <div className={`${phoneCls} left-[52%] top-24`}>
        <Shot src={b} alt={`${project.name} second screen`} label="Second screen" sizes="230px" className="aspect-[440/956]" />
      </div>
    </div>
  );
}

function Browser({ project }: { project: Project }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-panel">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
        </span>
        {project.links.live && <span className="font-mono text-xs text-muted">{hostOf(project.links.live)}</span>}
      </div>
      <Shot
        src={project.images?.cover}
        alt={`${project.name} homepage`}
        label="Homepage screenshot, 1440 × 900"
        sizes="(min-width: 1120px) 1056px, 100vw"
        className="aspect-[16/10]"
      />
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line pt-8 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12">
      <h2 className="font-mono text-xs tracking-[0.06em] text-muted">{label.toUpperCase()}</h2>
      <div className="min-w-0 max-w-[680px]">{children}</div>
    </section>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="space-y-4 text-[17px] leading-relaxed text-muted">
      {items.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[16px] leading-relaxed">
          <Icon name="check" className="mt-1.5 size-4 shrink-0 text-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CaseStudyView({ project, study, next }: { project: Project; study: CaseStudy; next?: Project }) {
  const hasScreens = !!project.images?.screens?.length;
  const hasCover = !!project.images?.cover;
  const heroIsDiagram = !hasScreens && !hasCover && !!project.architecture;
  const showArchitectureSection = !!project.architecture && !heroIsDiagram;

  const meta = [
    { label: "Role", value: project.role },
    { label: "Type", value: project.category },
    {
      label: "Status",
      value: (
        <span className="inline-flex items-center gap-2">
          <span className="size-[7px] rounded-full bg-live" />
          Live and in use
        </span>
      ),
    },
    ...(project.stat ? [{ label: "Scale", value: `${project.stat.value} ${project.stat.label}` }] : []),
    { label: "Stack", value: (project.fullStack ?? project.stack).join(" · ") },
    ...(project.links.live
      ? [
          {
            label: "Live",
            value: (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 hover:decoration-ink"
              >
                {hostOf(project.links.live)} ↗
              </a>
            ),
          },
        ]
      : []),
    ...(project.links.github?.length
      ? [
          {
            label: "Code",
            value: (
              <span className="flex flex-wrap gap-x-4">
                {project.links.github.map((g) => (
                  <a
                    key={g.url}
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-line underline-offset-4 hover:decoration-ink"
                  >
                    {g.label} ↗
                  </a>
                ))}
              </span>
            ),
          },
        ]
      : []),
  ];

  return (
    <main className="wrap pb-28 pt-10 sm:pt-14">
      <Link href="/work" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-ink">
        <span aria-hidden="true">←</span> All work
      </Link>

      {/* Header */}
      <FadeIn className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div>
          <p className="font-mono text-xs text-muted">Case study · {project.category}</p>
          <h1 className="mt-4 font-serif text-[clamp(48px,7vw,84px)] leading-none tracking-[-0.015em]">{project.name}</h1>
          {project.tagline && <p className="mt-4 font-serif text-2xl italic text-accent">{project.tagline}</p>}
          <p className="mt-6 max-w-[640px] text-lg leading-relaxed text-muted">{study.intro}</p>
        </div>
        <FactList items={meta} className="self-start" />
      </FadeIn>

      {/* Hero visual */}
      <FadeIn delay={0.08} className="mt-14">
        {hasScreens ? (
          <Phones project={project} />
        ) : hasCover ? (
          <Browser project={project} />
        ) : project.architecture ? (
          <div className="overflow-hidden rounded-[20px] border border-line bg-panel">
            <Architecture kind={project.architecture} className="py-10 sm:px-16" />
          </div>
        ) : (
          <Browser project={project} />
        )}
      </FadeIn>

      {/* Body */}
      <div className="mt-20 space-y-16">
        <FadeIn>
          <Block label="The problem">
            <Paragraphs items={study.problem} />
          </Block>
        </FadeIn>

        {showArchitectureSection && project.architecture && (
          <FadeIn>
            <Block label="How it works">
              <div className="overflow-hidden rounded-[20px] border border-line bg-panel">
                <Architecture kind={project.architecture} />
              </div>
            </Block>
          </FadeIn>
        )}

        <Block label="Key decisions">
          <ol className="space-y-14">
            {study.decisions.map((d, i) => (
              <li key={d.title}>
                <FadeIn>
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 font-serif text-[30px] leading-tight">{d.title}</h3>
                  <p className="mt-4 text-[16px] leading-relaxed text-muted">
                    <span className="font-mono text-xs uppercase tracking-[0.06em] text-ink">The risk · </span>
                    {d.risk}
                  </p>
                  <div className="mt-4">
                    <Checklist items={d.solution} />
                  </div>
                  {d.code && (
                    <pre className="mt-5 overflow-x-auto rounded-xl border border-line bg-panel p-4 font-mono text-[13px] leading-relaxed">
                      <code>{d.code}</code>
                    </pre>
                  )}
                </FadeIn>
              </li>
            ))}
          </ol>
        </Block>

        {study.extras && (
          <FadeIn>
            <Block label={study.extras.title}>
              <Checklist items={study.extras.items} />
            </Block>
          </FadeIn>
        )}

        <FadeIn>
          <Block label="Outcome">
            <Paragraphs items={study.outcome} />
          </Block>
        </FadeIn>

        {study.next?.length ? (
          <FadeIn>
            <Block label="What’s next">
              <Paragraphs items={study.next} />
            </Block>
          </FadeIn>
        ) : null}
      </div>

      {/* Footer of the case study */}
      <FadeIn className="mt-24 grid gap-10 border-t border-line pt-10 md:grid-cols-2">
        <div>
          <p className="font-serif text-[32px] leading-tight">Have something that needs to work in the real world?</p>
          <div className="mt-6">
            <Button href="/#contact">Get in touch</Button>
          </div>
        </div>
        {next && (
          <Link href={`/work/${next.slug}`} className="group block md:text-right">
            <span className="font-mono text-xs text-muted">Next case study</span>
            <span className="mt-2 block font-serif text-[40px] leading-tight transition-colors group-hover:text-accent">
              {next.name} →
            </span>
            <span className="mt-1 block text-muted">{next.oneLiner}</span>
          </Link>
        )}
      </FadeIn>
    </main>
  );
}