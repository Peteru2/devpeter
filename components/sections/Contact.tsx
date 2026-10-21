import { Suspense } from "react";
import { site } from "@/data/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { FadeIn } from "@/components/ui/FadeIn";
import { TextLink } from "@/components/ui/Links";
import { SectionHeader } from "@/components/ui/SectionHeader";

const socialLabels: Record<string, string> = { github: "GitHub", linkedin: "LinkedIn", x: "X (Twitter)" };

export function Contact() {
  const socials = Object.entries(site.socials).filter(([, url]) => !url.includes("TODO"));

  return (
    <section id="contact" aria-labelledby="contact-title" className="wrap pb-28">
      <SectionHeader
        id="contact-title"
        index="04"
        label="Contact"
        title="Have something that needs to work in the real world?"
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16">
        <FadeIn>
          <p className="text-lg leading-relaxed text-muted">
            A role, a product, a website, or a question. Send a message and let’s talk about it.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-block break-all border-b border-line pb-1 font-serif text-[28px] leading-tight transition-colors hover:border-ink"
          >
            {site.email}
          </a>
          {socials.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-6">
              {socials.map(([key, url]) => (
                <TextLink key={key} href={url} icon="external" external>
                  {socialLabels[key] ?? key}
                </TextLink>
              ))}
            </div>
          )}
          <p className="mt-6 font-mono text-xs text-muted">{site.location} · WAT (UTC+1)</p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="rounded-[20px] border border-line bg-panel p-6 sm:p-9">
            <Suspense fallback={<div className="h-[420px]" aria-hidden="true" />}>
              <ContactForm />
            </Suspense>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}