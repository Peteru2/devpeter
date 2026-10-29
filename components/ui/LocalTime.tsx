"use client";

import { useEffect, useState } from "react";

const ZONE = "Africa/Lagos"; // WAT, UTC+1 all year
const LAGOS_OFFSET_HOURS = 1;

const clock = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: ZONE }).format(new Date());

const gapLabel = () => {
  const visitor = -new Date().getTimezoneOffset() / 60;
  const diff = LAGOS_OFFSET_HOURS - visitor;
  if (diff === 0) return "same time zone as you";
  const hours = Number.isInteger(diff) ? Math.abs(diff) : Math.abs(diff).toFixed(1);
  return `${hours}h ${diff > 0 ? "ahead of" : "behind"} you`;
};

/** Shows the time in Peter's city, and how it compares to the visitor's, which helps remote teams plan a call. */
export function LocalTime({ location }: { location: string }) {
  const [now, setNow] = useState<{ time: string; gap: string } | null>(null);

  useEffect(() => {
    const tick = () => setNow({ time: clock(), gap: gapLabel() });
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="mt-6 font-mono text-xs text-muted">
      {location} · {now ? `${now.time} WAT, ${now.gap}` : "WAT (UTC+1)"}
    </p>
  );
}
