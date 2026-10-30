"use client";

import { useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, useCursor } from "@react-three/drei";
import type { Mesh } from "three";
import { GlowBox, Label, Stage, Sway, Text3D } from "./Stage";
import { usePalette, type Palette } from "./hooks";

type V3 = [number, number, number];

const SERVER: V3 = [0, 1.25, 0];
const CLOUD: V3 = [3.3, 1.7, 0];
const TERMINALS: V3[] = Array.from({ length: 6 }, (_, i) => [(i - 2.5) * 1.25, -1.45, 0]);
const DEVICE = "#1b1e25";

function Terminal({
  index,
  pos,
  on,
  palette,
  onToggle,
  onSaved,
}: {
  index: number;
  pos: V3;
  on: boolean;
  palette: Palette;
  onToggle: () => void;
  onSaved: () => void;
}) {
  const [hover, setHover] = useState(false);
  useCursor(hover);
  const pulse = useRef<Mesh>(null);
  const state = useRef({ next: -1, start: -1 });

  // While the terminal is on, it sends an "answer saved" pulse to the server every couple of seconds
  useFrame(({ clock }) => {
    const m = pulse.current;
    if (!m) return;
    const t = clock.elapsedTime;
    const s = state.current;
    if (!on) {
      s.start = -1;
      m.visible = false;
      return;
    }
    if (s.next < 0) s.next = t + Math.random() * 2;
    if (s.start < 0 && t >= s.next) s.start = t;
    if (s.start < 0) return;
    const p = (t - s.start) / 0.9;
    if (p >= 1) {
      s.start = -1;
      s.next = t + 1.4 + Math.random() * 1.8;
      m.visible = false;
      onSaved();
      return;
    }
    m.visible = true;
    m.position.set((SERVER[0] - pos[0]) * p, 0.3 + (SERVER[1] - 0.5 - pos[1] - 0.3) * p, 0.3);
  });

  return (
    <group
      position={pos}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      <GlowBox position={[0, 0, 0]} size={[1.02, 0.7, 0.1]} palette={palette} body={DEVICE} glow={() => (hover ? 0.6 : 0)}>
        <mesh position={[0, 0, 0.054]}>
          <planeGeometry args={[0.93, 0.61]} />
          <meshBasicMaterial color={on ? "#10131a" : "#2a2d35"} toneMapped={false} />
        </mesh>
        {on && (
          <>
            <mesh position={[-0.27, 0.2, 0.056]}>
              <planeGeometry args={[0.32, 0.05]} />
              <meshBasicMaterial color={palette.accent} toneMapped={false} />
            </mesh>
            <mesh position={[0.4, 0.2, 0.056]}>
              <circleGeometry args={[0.025, 12]} />
              <meshBasicMaterial color="#69db7c" toneMapped={false} />
            </mesh>
            {[0.07, -0.04, -0.15].map((y, i) => (
              <mesh key={y} position={[-0.05 - i * 0.04, y, 0.056]}>
                <planeGeometry args={[0.72 - i * 0.1, 0.035]} />
                <meshBasicMaterial color="#cdd3e4" transparent opacity={0.5} toneMapped={false} />
              </mesh>
            ))}
          </>
        )}
      </GlowBox>
      <mesh position={[0, -0.46, -0.02]}>
        <boxGeometry args={[0.12, 0.22, 0.06]} />
        <meshStandardMaterial color={DEVICE} />
      </mesh>
      <Text3D text={`PC ${index + 1}`} color={palette.muted} size={0.13} mono position={[0, -0.72, 0]} />
      <mesh ref={pulse} visible={false}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color={palette.accent} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** The exam server drawn as a small three-unit rack. Its borders flash as answers arrive. */
function Server({ glow, palette }: { glow: RefObject<number>; palette: Palette }) {
  useFrame((_, dt) => {
    glow.current = Math.max(0, glow.current - dt * 2.5);
  });
  return (
    <group position={SERVER}>
      {[0.36, 0, -0.36].map((y) => (
        <GlowBox key={y} position={[0, y, 0]} size={[1.6, 0.3, 0.45]} palette={palette} body={DEVICE} glow={() => glow.current}>
          <mesh position={[-0.62, 0, 0.228]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color="#69db7c" toneMapped={false} />
          </mesh>
          <mesh position={[0.18, 0, 0.228]}>
            <planeGeometry args={[0.95, 0.03]} />
            <meshBasicMaterial color="#3c404b" toneMapped={false} />
          </mesh>
        </GlowBox>
      ))}
      <Label title="Exam server" detail="Node.js · PostgreSQL" palette={palette} position={[0, 0.9, 0]} maxWidth={2.2} />
    </group>
  );
}

function Cloud({ internet, palette }: { internet: boolean; palette: Palette }) {
  const mesh = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (mesh.current && internet) {
      mesh.current.rotation.y += dt * 0.4;
      mesh.current.rotation.x += dt * 0.15;
    }
  });
  return (
    <group position={CLOUD}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.45, 1]} />
        <meshBasicMaterial wireframe color={internet ? palette.accent : palette.muted} transparent opacity={internet ? 0.7 : 0.3} toneMapped={false} />
      </mesh>
      <Text3D text={internet ? "Internet" : "Internet (cut)"} color={palette.muted} size={0.13} mono position={[0, -0.75, 0]} />
    </group>
  );
}

export default function CbtScene({ active, onReady }: { active: boolean; onReady: () => void }) {
  const palette = usePalette();
  const [on, setOn] = useState<boolean[]>(() => TERMINALS.map(() => true));
  const [internet, setInternet] = useState(true);
  const [saved, setSaved] = useState(0);
  const glow = useRef(0);
  const anyOn = on.some(Boolean);

  const onSaved = () => {
    glow.current = 1;
    setSaved((n) => n + 1);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <Stage active={active} width={8.6} height={5.6} onReady={onReady}>
          <Sway>
            <group position={[0, 0, 0]}>
              {TERMINALS.map((p, i) => (
                <Line key={i} points={[[0, 0.72, 0], [p[0], p[1] + 0.35, 0]]} color={palette.line} lineWidth={1.2} transparent opacity={on[i] ? 1 : 0.4} />
              ))}
              <Line
                points={[[0.85, 1.4, 0], [2.85, 1.65, 0]]}
                color={internet ? palette.accent : palette.danger}
                lineWidth={1.2}
                dashed
                dashSize={0.1}
                gapSize={internet ? 0.08 : 0.4}
                transparent
                opacity={internet ? 0.6 : 0.5}
              />
              <Server glow={glow} palette={palette} />
              <Cloud internet={internet} palette={palette} />
              {TERMINALS.map((p, i) => (
                <Terminal
                  key={i}
                  index={i}
                  pos={p}
                  on={on[i]}
                  palette={palette}
                  onToggle={() => setOn((prev) => prev.map((v, j) => (j === i ? !v : v)))}
                  onSaved={onSaved}
                />
              ))}
            </group>
          </Sway>
        </Stage>
      </div>

      <div className="shrink-0 border-t border-line px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOn(TERMINALS.map(() => !anyOn))}
            className="min-h-9 rounded-full border border-line px-3.5 text-[13px] transition-colors hover:border-ink"
          >
            {anyOn ? "Stop exam" : "Start exam"}
          </button>
          <button
            type="button"
            onClick={() => setInternet((v) => !v)}
            className={`min-h-9 rounded-full border px-3.5 text-[13px] transition-colors ${
              internet ? "border-line hover:border-ink" : "border-ink bg-ink text-bg"
            }`}
          >
            {internet ? "Cut the internet" : "Restore internet"}
          </button>
        </div>
        <div className="mt-2.5 flex min-h-[2.75rem] items-start gap-2.5 text-[13px] leading-snug">
          <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted">
            Answers saved: {saved}
          </span>
          <span aria-live="polite" className={internet ? "text-muted" : "text-ink"}>
            {internet
              ? "Everything runs on the local network. Click a terminal to switch it off."
              : "No internet, and nothing changes. The exam never needed it."}
          </span>
        </div>
      </div>
    </div>
  );
}