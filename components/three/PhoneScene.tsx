"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import { CanvasTexture, SRGBColorSpace } from "three";
import type { Group } from "three";
import { Stage, Sway } from "./Stage";
import { usePalette } from "./hooks";
import { panel, Slab } from "./Shapes";

type V3 = [number, number, number];

// ── Pick the device look here: "iphone" (Dynamic Island) or "android" (punch-hole camera) ──
const STYLE: keyof typeof DEVICES = "iphone";

const DEVICES = {
  iphone: {
    corner: 0.14,
    strip: 0.085, // status-bar strip above the screenshot, where the camera cut-out sits
    frame: "#55575e", // titanium
    metal: 0.95,
    rough: 0.32,
    island: true,
    buttons: [
      { s: -1, y: 0.66, h: 0.06 },
      { s: -1, y: 0.5, h: 0.11 },
      { s: -1, y: 0.33, h: 0.11 },
      { s: 1, y: 0.45, h: 0.17 },
    ],
  },
  android: {
    corner: 0.085,
    strip: 0.06,
    frame: "#2f3138",
    metal: 0.7,
    rough: 0.4,
    island: false,
    buttons: [
      { s: 1, y: 0.55, h: 0.2 },
      { s: 1, y: 0.25, h: 0.1 },
    ],
  },
} as const;

const d = DEVICES[STYLE];
const W = 1;
const H = 956 / 440; // your screenshots are 440 × 956
const HS = H + d.strip; // full screen height, including the status strip
const GLASS = 0.028; // black glass border around the screen
const RIM = 0.02; // metal rim around the glass
const WF = W + (GLASS + RIM) * 2;
const HF = HS + (GLASS + RIM) * 2;
const DEPTH = 0.1;

const hexToRgb = (hex: string): [number, number, number] => {
  const s = hex.replace("#", "");
  const f = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) || 0) as [number, number, number];
};

/** A faint diagonal sheen across the glass. */
function useGlare() {
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 256;
    const g = c.getContext("2d")!;
    const gr = g.createLinearGradient(0, 0, 128, 256);
    gr.addColorStop(0, "rgba(255,255,255,0.18)");
    gr.addColorStop(0.36, "rgba(255,255,255,0.05)");
    gr.addColorStop(0.37, "rgba(255,255,255,0)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 256);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => map.dispose(), [map]);
  return map;
}

function Phone({ src, position, tilt, phase }: { src: string; position: V3; tilt: number; phase: number }) {
  const map = useTexture(src);
  const glare = useGlare();
  const group = useRef<Group>(null);

  const geo = useMemo(
    () => ({
      screen: panel(W, HS, d.corner, H), // the screenshot fills the lower part; its top row stretches over the strip
      glare: panel(W, HS, d.corner),
      island: panel(0.3, 0.05, 0.025),
    }),
    []
  );
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);

  // a slow float, offset per phone
  useFrame(({ clock }) => {
    if (group.current) group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.9 + phase) * 0.03;
  });

  const front = DEPTH / 2 + 0.004; // front of the glass
  const metal = { color: d.frame, metalness: d.metal, roughness: d.rough };

  return (
    <group ref={group} position={position} rotation={[0, tilt, 0]}>
      {/* metal frame, then the black glass sitting slightly proud of it */}
      <Slab size={[WF, HF, DEPTH]} radius={d.corner + GLASS + RIM} bevel={0.016}>
        <meshStandardMaterial {...metal} />
      </Slab>
      <Slab size={[W + GLASS * 2, HS + GLASS * 2, DEPTH + 0.008]} radius={d.corner + GLASS} bevel={0.004}>
        <meshStandardMaterial color="#050507" roughness={0.15} metalness={0.2} />
      </Slab>

      {/* screen, sheen, camera cut-out */}
      <mesh geometry={geo.screen} position={[0, 0, front + 0.0005]}>
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      <mesh geometry={geo.glare} position={[0, 0, front + 0.0012]}>
        <meshBasicMaterial map={glare} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {d.island ? (
        <>
          <mesh geometry={geo.island} position={[0, HS / 2 - 0.0425, front + 0.002]}>
            <meshBasicMaterial color="#000000" toneMapped={false} />
          </mesh>
          <mesh position={[0.095, HS / 2 - 0.0425, front + 0.0025]}>
            <circleGeometry args={[0.011, 16]} />
            <meshBasicMaterial color="#1a2236" toneMapped={false} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, HS / 2 - 0.03, front + 0.002]}>
          <circleGeometry args={[0.02, 20]} />
          <meshBasicMaterial color="#000000" toneMapped={false} />
        </mesh>
      )}

      {/* side buttons */}
      {d.buttons.map((b) => (
        <mesh key={`${b.s}-${b.y}`} position={[b.s * (WF / 2 + 0.003), b.y, 0]}>
          <boxGeometry args={[0.014, b.h, 0.034]} />
          <meshStandardMaterial {...metal} />
        </mesh>
      ))}
    </group>
  );
}

/** A soft coloured pool of light or shadow behind the phones. */
function Radial({ color, alpha, position, size }: { color: string; alpha: number; position: V3; size: [number, number] }) {
  const map = useMemo(() => {
    const [r, g, b] = hexToRgb(color);
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const gr = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
    gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, 256, 256);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [color, alpha]);
  useEffect(() => () => map.dispose(), [map]);
  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={map} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

export default function PhoneScene({
  active,
  onReady,
  screens,
}: {
  active: boolean;
  onReady: () => void;
  screens: string[];
}) {
  const palette = usePalette();
  const [first, second = first] = screens;
  return (
    <div className="relative h-full">
      <Stage active={active} width={4} height={3.7} onReady={onReady}>
        {/* a studio-style reflection setup, built in code so it needs no downloads */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2} position={[0, 4, 3]} scale={[10, 1.5, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[-5, 0, 1]} rotation={[0, Math.PI / 2, 0]} scale={[8, 4, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[5, 0, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 4, 1]} />
          <Lightformer form="ring" intensity={0.9} color={palette.accent} position={[0, -3, 3]} scale={5} />
        </Environment>

        <Radial color={palette.accent} alpha={0.16} position={[0, 0.1, -1]} size={[5.5, 5.5]} />
        <Radial color="#0f1115" alpha={0.28} position={[0.05, -1.75, -0.5]} size={[4.6, 1]} />

        <Sway y={0.35} x={0.12}>
          <Phone src={first} position={[-0.78, 0.15, 0.25]} tilt={0.14} phase={0} />
          <Phone src={second} position={[0.88, -0.3, -0.2]} tilt={-0.14} phase={1.6} />
        </Sway>
      </Stage>
      <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-mono text-[11.5px] text-muted">
        Move over the phones to tilt them
      </p>
    </div>
  );
}