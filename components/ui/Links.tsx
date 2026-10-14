import Link from "next/link";
import { Icon, type IconName } from "./Icon";

type Props = {
  href: string;
  children: React.ReactNode;
  icon?: IconName;
  external?: boolean;
  download?: boolean;
  className?: string;
};

function Anchor({ href, external, download, className, children }: Omit<Props, "icon">) {
  if (external || download || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={className}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        download={download ? "" : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function Button({ icon = "arrow", className = "", children, ...rest }: Props) {
  return (
    <Anchor
      {...rest}
      className={`inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-[15px] font-medium text-bg transition-opacity hover:opacity-85 ${className}`}
    >
      {children}
      <Icon name={icon} />
    </Anchor>
  );
}

export function TextLink({ icon, className = "", children, ...rest }: Props) {
  return (
    <Anchor
      {...rest}
      className={`inline-flex min-h-11 items-center gap-1.5 border-b border-line text-[15px] font-medium transition-colors hover:border-ink ${className}`}
    >
      {children}
      {icon && <Icon name={icon} className="size-3.5" />}
    </Anchor>
  );
}