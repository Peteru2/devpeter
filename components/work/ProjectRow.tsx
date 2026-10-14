"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Project } from "@/data/projects";
import { FactList } from "@/components/ui/FactList";
import { Icon } from "@/components/ui/Icon";
import { Shot } from "@/components/ui/Shot";
import { Architecture } from "./Architecture";
import { hostOf, ProjectLinks, StackLine } from "./ProjectBits";

function RowVisual({ project }: { project: Project }) {
  if (!project.images?.cover && project.architecture) {
    return (
      <div className="min-h-[300px] overflow-hidden rounded-2xl border border-line bg-panel">
        <Architecture kind={project.architecture} />
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-panel">
      <div className="flex items-center gap-3 border-b border-line px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
        </span>
        {project.links.live && (
          <span className="truncate font-mono text-[11px] text-muted">{hostOf(project.links.live)}</span>
        )}
      </div>
      <Shot
        src={project.images?.cover}
        alt={`${project.name} homepage`}
        label="Homepage screenshot, 1440 × 900"
        sizes="(min-width: 1024px) 560px, 100vw"
        className="aspect-[16/10]"
      />
    </div>
  );
}

export function ProjectRow({ project, number }: { project: Project; number: number }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const buttonId = useId();
  const panelId = useId();
  const num = String(number).padStart(2, "0");

  return (
    <li className="border-b border-line">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-5 py-6 text-left sm:grid-cols-[3rem_minmax(0,1fr)_auto_auto]"
        >
          <span className="font-mono text-xs text-muted">{num}</span>
          <span className="min-w-0">
            <span className="block font-serif text-[28px] leading-tight transition-colors group-hover:text-accent sm:text-[34px]">
              {project.name}
            </span>
            <span className="mt-1 block text-[15px] text-muted">{project.oneLiner}</span>
          </span>
          <span className="hidden font-mono text-xs text-muted sm:block">
            {project.stat ? `${project.stat.value} ${project.stat.label}` : project.category}
          </span>
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-ink"
          >
            <Icon name="plus" className={`size-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 pb-10 sm:pl-[4.25rem] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
              <RowVisual project={project} />
              <div>
                <p className="text-[16px] leading-relaxed text-muted">{project.summary}</p>
                {project.stat && (
                  <p className="mt-6 flex items-baseline gap-3 border-y border-line py-4">
                    <span className="font-serif text-5xl leading-none">{project.stat.value}</span>
                    <span className="text-[15px] text-muted">{project.stat.label} so far</span>
                  </p>
                )}
                <FactList items={project.facts} className="mt-6" />
                <StackLine items={project.stack} className="mt-5" />
                <ProjectLinks project={project} className="mt-4" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}