"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/data/projects";
import { FactList } from "@/components/ui/FactList";
import { Shot } from "@/components/ui/Shot";
import { Architecture } from "./Architecture";
import { hostOf, ProjectLinks, StackLine } from "./ProjectBits";

type View = "product" | "architecture";

function Phone({ src, alt, label, className }: { src?: string; alt: string; label: string; className: string }) {
  return (
    <div
      className={`absolute w-[40%] max-w-[210px] overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_30px_60px_-30px_rgb(15_17_21/0.35)] ${className}`}
    >
      <Shot src={src} alt={alt} label={label} sizes="210px" className="aspect-[440/956]" />
    </div>
  );
}

export function FlagshipProject({ project, index }: { project: Project; index: number }) {
  const screens = project.images?.screens ?? [];
  const [view, setView] = useState<View>(screens.length || !project.architecture ? "product" : "architecture");
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      aria-labelledby={`${project.slug}-title`}
      className="grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16"
    >
      {/* Text */}
      <div>
        <p className="font-mono text-xs text-muted">
          {num} · {project.category}
        </p>
        <h3 id={`${project.slug}-title`} className="mt-3 font-serif text-5xl leading-none">
          {project.name}
        </h3>
        {project.tagline && <p className="mt-3 font-serif text-xl italic text-accent">{project.tagline}</p>}
        <p className="mt-5 text-[17px] leading-relaxed text-muted">{project.summary}</p>
        <FactList items={project.facts} className="mt-7" />
        <StackLine items={project.stack} className="mt-5" />
        <ProjectLinks project={project} className="mt-5" />
      </div>

      {/* Visual */}
      <div className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-panel">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          {project.architecture ? (
            <div role="group" aria-label="Choose view" className="inline-flex rounded-full border border-line bg-bg p-[3px]">
              {(["product", "architecture"] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={`min-h-10 rounded-full px-4 font-mono text-xs capitalize transition-colors ${
                    view === v ? "bg-ink text-bg" : "text-muted hover:text-ink"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          {project.links.live && <span className="font-mono text-[11.5px] text-muted">{hostOf(project.links.live)}</span>}
        </div>

        <div className="relative h-[420px] sm:h-[500px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              {view === "architecture" && project.architecture ? (
                <Architecture kind={project.architecture} />
              ) : (
                <>
                  <Phone
                    src={screens[0]}
                    alt={`${project.name} home screen`}
                    label={`${project.name} home screen`}
                    className="left-[7%] top-8 sm:left-[12%] sm:top-10"
                  />
                  <Phone
                    src={screens[1]}
                    alt={`${project.name} second screen`}
                    label="Second screen"
                    className="left-[52%] top-20 sm:top-24"
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </article>
  );
}