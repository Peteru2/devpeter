import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { caseStudies } from "@/data/caseStudies";
import { CaseStudyView } from "@/components/work/CaseStudyView";

type Props = { params: Promise<{ slug: string }> };

const withStudies = projects.filter((p) => p.hasCaseStudy && caseStudies[p.slug]);

export function generateStaticParams() {
  return withStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — case study`,
    description: project.summary,
  };
}

/* Reads the URL, so it lives inside <Suspense> */
async function CaseStudyContent({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  const study = caseStudies[slug];
  if (!project || !study) notFound();

  const i = withStudies.findIndex((p) => p.slug === slug);
  const next = withStudies.length > 1 ? withStudies[(i + 1) % withStudies.length] : undefined;

  return <CaseStudyView project={project} study={study} next={next} />;
}

export default function CaseStudyPage({ params }: Props) {
  return (
    <Suspense fallback={<main className="wrap min-h-[70vh] pt-14" aria-busy="true" />}>
      <CaseStudyContent params={params} />
    </Suspense>
  );
}