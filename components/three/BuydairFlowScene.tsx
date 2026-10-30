"use client";

import { useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Group } from "three";
import { GlowBox, Label, Stage, Sway } from "./Stage";
import { usePalette, type Palette } from "./hooks";

type NodeId = "client" | "api" | "db" | "paystack" | "vtu";
type Tone = "accent" | "live" | "danger" | "muted";
type Hop = { t: number; d: number; from: NodeId; to: NodeId; tone: Tone; fade: boolean };
type Beat = { t: number; text: string; tone?: Tone; n?: number };
type Scenario = { id: string; label: string; counter: string; hint: string; hops: Hop[]; beats: Beat[] };
type Run = { s: Scenario; key: number };
type Sync = { key: number; t: number };

const NODES: Record<NodeId, { pos: [number, number, number]; title: string; detail: string }> = {
  client: { pos: [0, 2.0, 0], title: "Client", detail: "React · Vite" },
  api: { pos: [0, 0.5, 0], title: "API", detail: "Node · Express · Zod" },
  db: { pos: [-2.5, -1.2, 0], title: "MongoDB", detail: "wallets · ledger" },
  paystack: { pos: [0, -1.2, 0], title: "Paystack", detail: "funding" },
  vtu: { pos: [2.5, -1.2, 0], title: "VTU provider", detail: "airtime · data" },
};
const LINKS: [NodeId, NodeId][] = [["client", "api"], ["api", "db"], ["api", "paystack"], ["api", "vtu"]];

// hop(startTime, from, to, tone?, fade?)  /  beat(time, caption, tone?, counterValue?)
const hop = (t: number, from: NodeId, to: NodeId, tone: Tone = "accent", fade = false): Hop => ({ t, d: 0.85, from, to, tone, fade });
const beat = (t: number, text: string, tone?: Tone, n?: number): Beat => ({ t, text, tone, n });

const scenarios: Scenario[] = [
  {
    id: "buy",
    label: "Buy airtime",
    counter: "Charges",
    hint: "Watch one purchase travel through the system.",
    hops: [hop(0, "client", "api"), hop(1, "api", "db"), hop(2, "api", "vtu"), hop(3.1, "vtu", "api", "live"), hop(4.1, "api", "db", "live"), hop(5.1, "api", "client", "live")],
    beats: [
      beat(0, "Tap Pay. The request carries a unique idempotency key."),
      beat(1.85, "Wallet debited and purchase saved as pending, in one transaction.", "accent", 1),
      beat(2.85, "Provider called with the purchase’s own request ID."),
      beat(3.95, "Provider confirms.", "live"),
      beat(4.95, "Purchase marked successful.", "live"),
      beat(5.95, "Done. Charged once.", "live"),
    ],
  },
  {
    id: "double",
    label: "Double-tap Pay",
    counter: "Charges",
    hint: "What happens when someone taps Pay twice?",
    hops: [hop(0, "client", "api"), hop(0.4, "client", "api"), hop(1, "api", "db"), hop(1.3, "api", "client", "muted"), hop(2, "api", "vtu"), hop(3.1, "vtu", "api", "live"), hop(4.1, "api", "client", "live")],
    beats: [
      beat(0, "First tap sent."),
      beat(0.4, "Second tap sent, with the same idempotency key."),
      beat(1.25, "Duplicate spotted by its key. No second charge.", "muted"),
      beat(1.85, "Wallet debited once.", "accent", 1),
      beat(2.15, "The duplicate gets the saved reply instead.", "muted"),
      beat(2.85, "Provider called."),
      beat(3.95, "Provider confirms.", "live"),
      beat(4.95, "Done. Charged once.", "live"),
    ],
  },
  {
    id: "timeout",
    label: "Provider times out",
    counter: "Charges",
    hint: "A slow provider isn’t a failed one.",
    hops: [hop(0, "client", "api"), hop(1, "api", "db"), hop(2, "api", "vtu"), hop(3, "vtu", "api", "danger", true), hop(6, "api", "vtu"), hop(7, "vtu", "api", "live"), hop(8, "api", "db", "live"), hop(9, "api", "client", "live")],
    beats: [
      beat(0, "Tap Pay."),
      beat(1.85, "Wallet debited and purchase saved as pending.", "accent", 1),
      beat(2.85, "Provider called."),
      beat(3.85, "No answer. It stays pending: never guessed, never called failed.", "danger"),
      beat(4.4, "The app shows “We’re confirming this”, not “failed”."),
      beat(6, "A background job re-checks pending purchases."),
      beat(7.85, "Provider confirms.", "live"),
      beat(8.85, "Marked successful.", "live"),
      beat(9.85, "Done. Still charged once.", "live"),
    ],
  },
  {
    id: "topup",
    label: "Top up wallet",
    counter: "Credits",
    hint: "The webhook and the app can both report the same payment.",
    hops: [hop(0, "client", "api"), hop(1, "api", "paystack"), hop(2.2, "paystack", "api"), hop(2.5, "client", "api"), hop(3.2, "api", "db", "live"), hop(3.5, "api", "db", "muted"), hop(4.6, "api", "client", "live")],
    beats: [
      beat(0, "Top-up started."),
      beat(1.85, "Customer pays at Paystack: card, transfer or USSD."),
      beat(3.05, "Webhook arrives. Signature, amount and currency are checked."),
      beat(3.35, "At the same moment, the app asks: did it go through?"),
      beat(4.05, "First path credits the wallet, once.", "live", 1),
      beat(4.35, "Second path finds nothing left to credit and stops.", "muted"),
      beat(5.45, "Balance updates live.", "live"),
    ],
  },
];

const toneText: Record<Tone, string> = { accent: "text-ink", live: "text-live", danger: "text-danger", muted: "text-muted" };

function Packet({ h, runKey, sync, palette }: { h: Hop; runKey: number; sync: RefObject<Sync>; palette: Palette }) {
  const group = useRef<Group>(null);
  const a = NODES[h.from].pos;
  const b = NODES[h.to].pos;
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const p = (sync.current.t - h.t) / h.d;
    const on = sync.current.key === runKey && p >= 0 && p <= 1;
    g.visible = on;
    if (!on) return;
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // ease in-out
    g.position.set(a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, 0.35);
    g.scale.setScalar(h.fade ? Math.max(0.001, 1 - Math.max(0, (p - 0.45) / 0.55)) : 1);
  });
  return (
    <group ref={group} visible={false}>
      <mesh>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshBasicMaterial color={palette[h.tone]} toneMapped={false} />
      </mesh>
      <mesh scale={2.2}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color={palette[h.tone]} transparent opacity={0.18} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Owns the timeline: tracks seconds since the run began and fires each caption when its time arrives. */
function Timeline({ run, sync, onBeat }: { run: Run; sync: RefObject<Sync>; onBeat: (b: Beat) => void }) {
  const origin = useRef(0);
  const next = useRef(0);
  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    if (sync.current.key !== run.key) {
      sync.current.key = run.key;
      origin.current = now;
      next.current = 0;
    }
    sync.current.t = now - origin.current;
    const { beats } = run.s;
    while (next.current < beats.length && sync.current.t >= beats[next.current].t) onBeat(beats[next.current++]);
  });
  return null;
}

export default function BuydairFlowScene({ active, onReady }: { active: boolean; onReady: () => void }) {
  const palette = usePalette();
  const sync = useRef<Sync>({ key: -1, t: 0 });
  const [run, setRun] = useState<Run>({ s: scenarios[0], key: 0 });
  const [current, setCurrent] = useState<Beat | null>(null);
  const [count, setCount] = useState(0);

  const start = (s: Scenario) => {
    setCurrent(null);
    setCount(0);
    setRun({ s, key: Date.now() });
  };
  const onBeat = (b: Beat) => {
    setCurrent(b);
    if (b.n !== undefined) setCount(b.n);
  };

  // How brightly a node glows: it flashes for 0.7s after a packet arrives
  const glowFor = (id: NodeId) => () => {
    if (sync.current.key !== run.key) return 0;
    let g = 0;
    for (const h of run.s.hops) {
      const since = sync.current.t - (h.t + h.d);
      if (h.to === id && since >= 0 && since < 0.7) g = Math.max(g, 1 - since / 0.7);
    }
    return g;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <Stage active={active} width={7.6} height={5} onReady={onReady}>
          <Sway>
            <group position={[0, -0.4, 0]}>
              {LINKS.map(([a, b]) => (
                <Line key={a + b} points={[NODES[a].pos, NODES[b].pos]} color={palette.line} lineWidth={1.4} />
              ))}
              {(Object.keys(NODES) as NodeId[]).map((id) => (
               <GlowBox key={id} position={NODES[id].pos} size={[1.9, 0.78, 0.16]} palette={palette} glow={glowFor(id)}>
                    <Label title={NODES[id].title} detail={NODES[id].detail} palette={palette} position={[0, 0, 0.1]} />
                </GlowBox>
              ))}
              <Timeline run={run} sync={sync} onBeat={onBeat} />
              {run.s.hops.map((h, i) => (
                <Packet key={`${run.key}-${i}`} h={h} runKey={run.key} sync={sync} palette={palette} />
              ))}
            </group>
          </Sway>
        </Stage>
      </div>

      <div className="shrink-0 border-t border-line px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={run.s.id === s.id}
              onClick={() => start(s)}
              className={`min-h-9 rounded-full border px-3.5 text-[13px] transition-colors ${
                run.s.id === s.id ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="mt-2.5 flex min-h-[2.75rem] items-start gap-2.5 text-[13px] leading-snug">
          <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">
            {run.s.counter}: {count}
          </span>
          <span aria-live="polite" className={toneText[current?.tone ?? "accent"]}>
            {current?.text ?? run.s.hint}
          </span>
        </div>
      </div>
    </div>
  );
}