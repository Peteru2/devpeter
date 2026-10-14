import Image from "next/image";
import { site } from "@/data/site";

export function Avatar({ size = 64 }: { size?: number }) {
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full border border-line bg-panel"
      style={{ width: size, height: size }}
    >
      {site.photo ? (
        <Image src={site.photo} alt={`Portrait of ${site.name}`} fill sizes={`${size}px`} className="object-cover" priority />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted">OP</span>
      )}
    </span>
  );
}

export function Portrait() {
  return (
    <div className="relative aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-2xl border border-line bg-panel">
      {site.photo ? (
        <Image src={site.photo} alt={`Portrait of ${site.name}`} fill sizes="300px" className="object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted">[Your photo]</span>
      )}
    </div>
  );
}