import { navItems, site } from "@/data/site";
import { CurrentYear } from "@/components/ui/CurrentYear";

const socialLabels: Record<string, string> = { github: "GitHub", linkedin: "LinkedIn", x: "X" };

export function Footer() {
  const socials = Object.entries(site.socials).filter(([, url]) => !url.includes("TODO"));

  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-col gap-10 py-14">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <p className="font-serif text-2xl leading-none">{site.name}</p>
            <p className="mt-2 font-mono text-xs text-muted">
              {site.handle} · {site.role}
            </p>
          </div>

          <nav aria-label="Footer">
                        <ul className="flex flex-wrap gap-x-7">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`/#${item.id}`} className="inline-flex min-h-11 items-center text-sm text-muted hover:text-ink">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-wrap gap-x-6">
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center text-sm text-muted hover:text-ink">
                Email
              </a>
            </li>
            {socials.map(([key, url]) => (
              <li key={key}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-sm text-muted hover:text-ink"
                >
                  {socialLabels[key] ?? key} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 font-mono text-xs text-muted">
          <p>
                      © <CurrentYear /> {site.name}
          </p>
          <a href="#top" className="inline-flex min-h-11 items-center hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}