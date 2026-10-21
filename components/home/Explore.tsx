import { Tabs } from "./Tabs";
import { WorkPanel } from "./WorkPanel";
import { SkillsPanel } from "./SkillPanel";
import { PrinciplesPanel } from "./PrinciplesPanel";
import { NowPanel } from "./NowPanel";

export function Explore() {
  return (
    <section id="work" aria-label="Work, skills and what I’m working on" className="wrap pb-28">
      <p className="border-t border-line pt-7 font-mono text-xs tracking-[0.06em] text-muted">01 — EXPLORE</p>
      <div className="mt-6">
        <Tabs
          label="Explore my work"
          defaultId="work"
          tabs={[
            { id: "work", label: "Work", content: <WorkPanel /> },
            { id: "skills", label: "Skills", content: <SkillsPanel /> },
            { id: "how", label: "How I work", content: <PrinciplesPanel /> },
            { id: "now", label: "Now", content: <NowPanel /> },
          ]}
        />
      </div>
    </section>
  );
}