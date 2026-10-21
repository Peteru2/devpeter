export function PanelHeading({
  title,
  intro,
  action,
}: {
  title: string;
  intro?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <div>
        <h2 className="max-w-[760px] font-serif text-[clamp(32px,4vw,48px)] leading-[1.05] tracking-[-0.01em]">
          {title}
        </h2>
        {intro && <p className="mt-3 max-w-[600px] text-[17px] leading-relaxed text-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}