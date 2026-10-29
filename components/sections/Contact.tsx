import { Suspense } from "react";
import { site } from "@/data/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { FadeIn } from "@/components/ui/FadeIn";
import { TextLink } from "@/components/ui/Links";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { LocalTime } from "@/components/ui/LocalTime";
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
            Hiring, building something, or just curious? Send a message and I’ll get back to you.
          </p>
          <CopyEmail email={site.email} />
          {socials.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-6">
              {socials.map(([key, url]) => (
                <TextLink key={key} href={url} icon="external" external>
                  {socialLabels[key] ?? key}
                </TextLink>
              ))}
            </div>
          )}
          <LocalTime location={site.location} />
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