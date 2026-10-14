"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ArchitectureKey } from "@/data/projects";

function Line({ d, dashed = false, delay = 0 }: { d: string; dashed?: boolean; delay?: number }) {
  const reduce = useReducedMotion();
  if (dashed) {
    return (
      <motion.path
        d={d}
        fill="none"
        strokeWidth={1.3}
        strokeDasharray="4 4"
        className="stroke-accent"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.6 }}
      />
    );
  }
  return (
    <motion.path
      d={d}
      fill="none"
      strokeWidth={1.3}
      className="stroke-accent"
      initial={reduce ? false : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: "easeInOut" }}
    />
  );
}

function Box({
  x, y, w, h, title, detail, emphasis = false, dashed = false,
}: {
  x: number; y: number; w: number; h: number; title: string; detail: string; emphasis?: boolean; dashed?: boolean;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={8}
        strokeWidth={1.3}
        strokeDasharray={dashed ? "4 4" : undefined}
        className={emphasis ? "fill-tint stroke-accent" : "fill-bg stroke-accent"}
      />
      <text x={cx} y={y + h / 2 - 3} textAnchor="middle" className="fill-ink font-sans text-[14px] font-medium">
        {title}
      </text>
      <text x={cx} y={y + h / 2 + 14} textAnchor="middle" className="fill-muted font-mono text-[10.5px]">
        {detail}
      </text>
    </g>
  );
}

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} className="fill-muted font-mono text-[10.5px]">
      {children}
    </text>
  );
}

function BuydairDiagram() {
  return (
    <>
      <Line d="M260 76 V122" />
      <Line d="M260 182 V214" delay={0.2} />
      <Line d="M95 250 V214 H425 V250" delay={0.35} />
      <Line d="M260 214 V250" delay={0.35} />
      <Line d="M310 250 C 320 225, 330 205, 345 182" dashed delay={0.4} />
      <Box x={150} y={20} w={220} h={56} title="Client" detail="React · Vite · TanStack Query" />
      <Box x={140} y={122} w={240} h={60} title="API" detail="Node.js · Express · Zod · Socket.IO" emphasis />
      <Box x={20} y={250} w={150} h={58} title="MongoDB" detail="users · wallets · ledger" />
      <Box x={185} y={250} w={150} h={58} title="Paystack" detail="funding · cards · USSD" />
      <Box x={350} y={250} w={150} h={58} title="VTU provider" detail="airtime · data · bills" />
      <Label x={272} y={104}>REST · JSON</Label>
      <Label x={352} y={214}>webhook verify</Label>
    </>
  );
}

function CbtDiagram() {
  return (
    <>
      <Line d="M260 82 V150" />
      <Line d="M70 196 V150 H450 V196" delay={0.25} />
      <Line d="M197 150 V196" delay={0.25} />
      <Line d="M323 150 V196" delay={0.25} />
      <Box x={150} y={22} w={220} h={60} title="Exam server" detail="Node.js · one local machine" emphasis />
      <Box x={20} y={196} w={100} h={52} title="PC 1" detail="student" />
      <Box x={147} y={196} w={100} h={52} title="PC 2" detail="student" />
      <Box x={273} y={196} w={100} h={52} title="PC 3" detail="student" />
      <Box x={400} y={196} w={100} h={52} title="PC …" detail="student" dashed />
      <Label x={272} y={118}>LAN · no internet</Label>
    </>
  );
}

const diagrams: Record<ArchitectureKey, { viewBox: string; label: string; caption: string; Content: () => React.ReactNode }> = {
  buydair: {
    viewBox: "0 0 520 330",
    label: "Buydair architecture: a React client talks to a Node and Express API, which connects to MongoDB, Paystack and a VTU provider",
    caption: "Stuck purchases are re-checked automatically; refunds are PIN-protected and audited.",
    Content: BuydairDiagram,
  },
  cbt: {
    viewBox: "0 0 520 270",
    label: "Offline CBT architecture: one exam server connects over a local network to many student computers, with no internet",
    caption: "Exams run with no internet; students pull their report sheets afterwards.",
    Content: CbtDiagram,
  },
};

export function Architecture({ kind, className = "" }: { kind: ArchitectureKey; className?: string }) {
  const { viewBox, label, caption, Content } = diagrams[kind];
  return (
    <figure className={`grid-paper m-0 flex h-full flex-col justify-center px-5 py-6 sm:px-8 ${className}`}>
      <svg viewBox={viewBox} role="img" aria-label={label} className="h-auto w-full">
        <Content />
      </svg>
      <figcaption className="mt-4 text-center font-mono text-[11.5px] leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  );
}