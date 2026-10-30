"use client";

import { useEffect, useState } from "react";

export type Palette = {
  bg: string;
  ink: string;
  muted: string;
  accent: string;
  panel: string;
  live: string;
  danger: string;
  /** A soft hairline colour, mixed from panel and ink (your --color-line has transparency, which 3D can't use) */
  line: string;
};

const FALLBACK: Palette = {
  bg: "#faf8f3",
  ink: "#16181d",
  muted: "#5b6070",
  accent: "#2747c8",
  panel: "#f2efe8",
  live: "#2b8a3e",
  danger: "#b42318",
  line: "#d9d6d0",
};

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Blend two hex colours; t = 0 gives a, t = 1 gives b. */
function mix(a: string, b: string, t: number): string {
  if (!HEX.test(a) || !HEX.test(b)) return a;
  const parse = (h: string) => {
    const s = h.slice(1);
    const f = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
    return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
  };
  const [pa, pb] = [parse(a), parse(b)];
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

/** The site's font stacks, for text drawn inside the 3D scene. */
export function fontStack(mono: boolean): string {
  const css = getComputedStyle(document.documentElement);
  const value = css.getPropertyValue(mono ? "--font-mono" : "--font-sans").trim();
  return value || (mono ? "ui-monospace, Menlo, monospace" : "system-ui, sans-serif");
}

function read(): Palette {
  const css = getComputedStyle(document.documentElement);
  const get = (name: Exclude<keyof Palette, "line">) => css.getPropertyValue(`--color-${name}`).trim() || FALLBACK[name];
  const panel = get("panel");
  const ink = get("ink");
  return {
    bg: get("bg"),
    ink,
    muted: get("muted"),
    accent: get("accent"),
    panel,
    live: get("live"),
    danger: get("danger"),
    line: mix(panel, ink, 0.2),
  };
}

/** Your site's colours as hex strings, so 3D materials follow light/dark mode. */
export function usePalette(): Palette {
  const [palette, setPalette] = useState<Palette>(FALLBACK);

  useEffect(() => {
    const update = () => setPalette(read());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const media = matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  return palette;
}

/** null = still checking, false = show the 2D fallback instead. */
export function useCanRender3D(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setOk(!reduceMotion && !saveData && webgl);
  }, []);

  return ok;
}