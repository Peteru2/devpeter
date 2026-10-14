export function FactList({
  items,
  className = "",
}: {
  items: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <dl className={`border-t border-line ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex gap-4 border-b border-line py-3.5">
          <dt className="w-28 shrink-0 pt-0.5 font-mono text-xs text-muted">{item.label}</dt>
          <dd className="min-w-0 text-[15px] leading-relaxed">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}