"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { ExtrudeGeometry, Shape, ShapeGeometry } from "three";

type V3 = [number, number, number];

/** A rounded-rectangle outline centred on the origin. */
export function roundedRect(w: number, h: number, r: number) {
  const x = -w / 2;
  const y = -h / 2;
  const s = new Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/**
 * A flat rounded panel with texture coordinates. `uvH` is the height the texture's v axis covers:
 * make it smaller than `h` and the texture's top edge stretches across the leftover strip.
 */
export function panel(w: number, h: number, r: number, uvH = h) {
  const g = new ShapeGeometry(roundedRect(w, h, r), 16);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / uvH);
  return g;
}

/** A rounded slab: corner radius `r` in the front view, with a small bevel `b` on its edges. Exactly w × h × d. */
function makeSlab(w: number, h: number, d: number, r: number, b: number) {
  const shape = roundedRect(w - 2 * b, h - 2 * b, Math.max(r - b, 0.001));
  const g = new ExtrudeGeometry(shape, {
    depth: d - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: 3,
    curveSegments: 20,
  });
  g.translate(0, 0, -(d - 2 * b) / 2);
  return g;
}

export function Slab({
  size,
  radius,
  bevel = 0.012,
  position,
  children,
}: {
  size: V3;
  radius: number;
  bevel?: number;
  position?: V3;
  children?: ReactNode;
}) {
  const [w, h, d] = size;
  const geometry = useMemo(() => makeSlab(w, h, d, radius, bevel), [w, h, d, radius, bevel]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} position={position}>
      {children}
    </mesh>
  );
}