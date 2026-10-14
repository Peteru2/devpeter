export function SectionHeader({
  id,
  index,
  label,
  title,
  action,
}: {
  id: string;
  index: string;
  label: string;
  title: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-t border-line pt-7">
      <div>
        <p className="font-mono text-xs tracking-[0.06em] text-muted">
          {index} — {label.toUpperCase()}
        </p>
        <h2 id={id} className="mt-3.5 max-w-[760px] font-serif text-[clamp(36px,4.6vw,54px)] leading-[1.05] tracking-[-0.01em]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}