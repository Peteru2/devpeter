import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/projects";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProjectLinks, StackLine } from "@/components/work/ProjectBits";

export const metadata: Metadata = {
  title: "All work",
  description: "Products by Olatunji Peter (devpeter): payments, exams, community platforms and business websites.",
};


export default function WorkIndex() {
  const list = projects.filter((p) => p.tier !== "archive");

  return (
    <main className="wrap pb-28 pt-14 sm:pt-20">
      <FadeIn>
        <p className="font-mono text-xs tracking-[0.06em] text-muted">ALL WORK</p>
        <h1 className="mt-4 max-w-[760px] font-serif text-[clamp(44px,6vw,72px)] leading-[1.02] tracking-[-0.015em]">
          Everything I’ve built and shipped.
        </h1>
      </FadeIn>

      <ul className="mt-16 border-t border-line">
        {list.map((p, i) => (
          <li key={p.slug} className="border-b border-line">
            <FadeIn className="grid gap-x-6 gap-y-4 py-8 sm:grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[3rem_minmax(0,1fr)_auto] lg:items-center">
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted">{p.category}</p>
                <h2 className="mt-1.5 font-serif text-[34px] leading-tight">
                  {p.hasCaseStudy ? (
                    <Link href={`/work/${p.slug}`} className="transition-colors hover:text-accent">
                      {p.name}
                    </Link>
                  ) : (
                    p.name
                  )}
                </h2>
                <p className="mt-1.5 text-muted">{p.oneLiner}</p>
                <StackLine items={p.stack} className="mt-3" />
              </div>
              <ProjectLinks project={p} className="sm:col-start-2 lg:col-start-auto lg:justify-end" />
            </FadeIn>
          </li>
        ))}
      </ul>
    </main>
  );
}