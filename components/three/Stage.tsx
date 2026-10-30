"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Slab } from "./Shapes";
import { CanvasTexture, Color, SRGBColorSpace } from "three";
import type { Group, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera } from "three";
import { fontStack, type Palette } from "./hooks";

type V3 = [number, number, number];

/** Moves the camera back until a width × height area of the scene fits the canvas, on any screen shape. */
function FitCamera({ width, height }: { width: number; height: number }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  useEffect(() => {
    const half = Math.tan((camera.fov * Math.PI) / 360);
    const byWidth = width / (size.width / size.height) / 2 / half;
    const byHeight = height / 2 / half;
    camera.position.z = Math.max(byWidth, byHeight);
    camera.updateProjectionMatrix();
  }, [camera, size, width, height]);
  return null;
}

function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return null;
}

export function Stage({
  active,
  width,
  height,
  onReady,
  children,
}: {
  active: boolean;
  width: number;
  height: number;
  onReady?: () => void;
  children: ReactNode;
}) {
  return (
    <Canvas
      flat
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 10], fov: 40 }}
      gl={{ powerPreference: "low-power" }}
      style={{ touchAction: "pan-y" }}
    >
      <FitCamera width={width} height={height} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 6]} intensity={0.7} />
      {children}
      <Ready onReady={onReady} />
    </Canvas>
  );
}

/** Gentle idle sway that also leans toward the cursor. */
export function Sway({ children, y = 0.16, x = 0.07 }: { children: ReactNode; y?: number; x?: number }) {
  const group = useRef<Group>(null);
  useFrame(({ pointer, clock }, dt) => {
    const o = group.current;
    if (!o) return;
    const t = clock.elapsedTime;
    const k = Math.min(1, dt * 3);
    o.rotation.y += (Math.sin(t * 0.5) * y * 0.6 + pointer.x * y - o.rotation.y) * k;
    o.rotation.x += (Math.sin(t * 0.4) * x * 0.5 - pointer.y * x - o.rotation.x) * k;
  });
  return <group ref={group}>{children}</group>;
}

export function GlowBox({
  position,
  size,
  palette,
  glow,
  body,
  radius = 0.09,
  children,
}: {
  position: V3;
  size: V3;
  palette: Palette;
  glow: () => number;
  body?: string;
  radius?: number;
  children?: ReactNode;
}) {
  const rim = useRef<MeshBasicMaterial>(null);
  const fill = useRef<MeshStandardMaterial>(null);
  const colors = useMemo(() => ({ line: new Color(palette.line), accent: new Color(palette.accent) }), [palette.line, palette.accent]);

  useFrame(() => {
    const g = glow();
    rim.current?.color.copy(colors.line).lerp(colors.accent, g);
    if (fill.current) fill.current.emissiveIntensity = g * 0.15;
  });

  const [w, h, d] = size;
  return (
    <group position={position}>
      <Slab size={[w + 0.044, h + 0.044, d - 0.02]} radius={radius + 0.022} bevel={0.008}>
        <meshBasicMaterial ref={rim} color={palette.line} toneMapped={false} />
      </Slab>
      <Slab size={size} radius={radius} bevel={0.01}>
        <meshStandardMaterial ref={fill} color={body ?? palette.bg} emissive={palette.accent} emissiveIntensity={0} roughness={0.8} />
      </Slab>
      {children}
    </group>
  );
}

const TEXT_PX = 64; // resolution the text is drawn at; the on-screen size comes from the `size` prop

/**
 * Text drawn onto a canvas and shown on a plane inside the scene. It scales with the scene,
 * so it can never drift out of place or overlap the way pixel-sized overlays do, and it needs no network.
 */
export function Text3D({
  text,
  color,
  size = 0.16,
  weight = 500,
  mono = false,
  position = [0, 0, 0],
  maxWidth,
  opacity = 1,
}: {
  text: string;
  color: string;
  size?: number;
  weight?: number;
  mono?: boolean;
  position?: V3;
  maxWidth?: number;
  opacity?: number;
}) {
  const [label, setLabel] = useState<{ map: CanvasTexture; w: number; h: number } | null>(null);

  useEffect(() => {
    const font = `${weight} ${TEXT_PX}px ${fontStack(mono)}`;
    let current: CanvasTexture | null = null;
    let cancelled = false;

    const draw = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = font;
      const w = Math.ceil(ctx.measureText(text).width) + 8;
      const h = Math.ceil(TEXT_PX * 1.4);
      canvas.width = w;
      canvas.height = h;
      ctx.font = font; // resizing a canvas resets its context
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w / 2, h / 2);
      const map = new CanvasTexture(canvas);
      map.colorSpace = SRGBColorSpace;
      map.anisotropy = 4;
      current?.dispose();
      current = map;
      setLabel({ map, w, h });
    };

    draw();
    // Redraw once the site font has actually loaded
    document.fonts?.load(font, text).then(() => !cancelled && draw()).catch(() => {});
    return () => {
      cancelled = true;
      current?.dispose();
    };
  }, [text, color, weight, mono]);

  if (!label) return null;
  const k = size / TEXT_PX;
  let w = label.w * k;
  let h = label.h * k;
  if (maxWidth && w > maxWidth) {
    const shrink = maxWidth / w;
    w *= shrink;
    h *= shrink;
  }
  return (
    <mesh position={position}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={label.map} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/** A title with an optional detail line underneath. The detail hides itself on narrow canvases. */
export function Label({
  title,
  detail,
  palette,
  position = [0, 0, 0.1],
  maxWidth = 1.7,
}: {
  title: string;
  detail?: string;
  palette: Palette;
  position?: V3;
  maxWidth?: number;
}) {
  const wide = useThree((s) => s.size.width) >= 480;
  const showDetail = !!detail && wide;
  const [x, y, z] = position;
  return (
    <>
      <Text3D text={title} color={palette.ink} size={0.2} weight={600} position={[x, y + (showDetail ? 0.1 : 0), z]} maxWidth={maxWidth} />
      {showDetail && <Text3D text={detail} color={palette.muted} size={0.115} mono position={[x, y - 0.14, z]} maxWidth={maxWidth} />}
    </>
  );
}