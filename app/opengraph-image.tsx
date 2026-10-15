import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#faf8f3",
          color: "#16181d",
          backgroundImage:
            "linear-gradient(rgba(39,71,200,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(39,71,200,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#5b6070" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#2b8a3e" }} />
          Available for roles and freelance
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: 980 }}>
            I build software people rely on: payments, exams, and the platforms in between.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(22,24,29,0.15)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 36, fontWeight: 600 }}>{site.name}</div>
            <div style={{ fontSize: 24, color: "#5b6070" }}>
              {site.handle} · {site.role}
            </div>
          </div>
          <div style={{ fontSize: 24, color: "#2747c8" }}>{site.location}</div>
        </div>
      </div>
    ),
    size
  );
}