const paths = {
  arrow: <path d="M3 8h10M9 4l4 4-4 4" />,
  external: <path d="M5 11L11 5M6 5h5v5" />,
  download: <path d="M8 2v9M4 7l4 4 4-4M3 14h10" />,
  check: <path d="M3 8.5l3.2 3L13 4.5" />,
  plus: <path d="M8 3v10M3 8h10" />,
  menu: <path d="M2 5h12M2 11h12" />,
  close: <path d="M4 4l8 8M12 4l-8 8" />,
  chat: <path d="M2.5 3.5h11v7.5H7l-3.5 2.5V11H2.5z" />,
    sun: (
    <>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06" />
    </>
  ),
  moon: <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-4" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}