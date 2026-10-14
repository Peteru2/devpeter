import Image from "next/image";

export function Shot({
  src,
  alt,
  label,
  sizes,
  className = "",
}: {
  src?: string;
  alt: string;
  label: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-panel ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-xs text-muted">
          [{label}]
        </span>
      )}
    </div>
  );
}