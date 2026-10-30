"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { ArchitectureKey } from "@/data/projects";
import { Architecture } from "@/components/work/Architecture";
import { useCanRender3D } from "./hooks";

// Loaded on demand, so the 3D code never weighs down the first page load
const PhoneScene = dynamic(() => import("./PhoneScene"), { ssr: false });
const BuydairFlowScene = dynamic(() => import("./BuydairFlowScene"), { ssr: false });
const CbtScene = dynamic(() => import("./CbtScene"), { ssr: false });

/**
 * Shows `fallback` (your existing 2D content) until the 3D scene is on screen and ready.
 * It stays as the permanent fallback for reduced motion, data saver and browsers without WebGL.
 */
function Viewport3D({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: (active: boolean, onReady: () => void) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const can3D = useCanRender3D();
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !can3D) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { rootMargin: "120px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [can3D]);

  return (
    <div ref={ref} className="relative isolate h-full w-full">
      {!(can3D && ready) && fallback}
      {can3D && seen && (
        <div className={ready ? "h-full" : "pointer-events-none absolute inset-0 opacity-0"}>
          {children(visible, markReady)}
        </div>
      )}
    </div>
  );
}

export function PhoneShowcase({ screens, fallback }: { screens: string[]; fallback: ReactNode }) {
  if (!screens.length) return <>{fallback}</>;
  return (
    <Viewport3D fallback={fallback}>
      {(active, onReady) => <PhoneScene active={active} onReady={onReady} screens={screens} />}
    </Viewport3D>
  );
}

export function ArchitectureView({ kind }: { kind: ArchitectureKey }) {
  return (
    <Viewport3D fallback={<Architecture kind={kind} />}>
      {(active, onReady) =>
        kind === "buydair" ? (
          <BuydairFlowScene active={active} onReady={onReady} />
        ) : (
          <CbtScene active={active} onReady={onReady} />
        )
      }
    </Viewport3D>
  );
}