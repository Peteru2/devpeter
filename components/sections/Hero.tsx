import { site } from "@/data/site";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button, TextLink } from "@/components/ui/Links";
import { Avatar } from "@/components/ui/Photo";
import { AskChips } from "@/components/ui/AskChips";
import { RotatingWord } from "@/components/ui/RotatingWord";

const facts = [
 { label: "NOW", value: `${site.currentRole.title} at ${site.currentRole.org}`, href: "/?tab=now#work" },
  { label: "EXPERIENCE", value: `${site.experience} shipping production software` },
  { label: "FOCUS", value: "Fintech & payments · EdTech" },
  { label: "PROOF", value: "Live products, 1,000+ students served" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="wrap pb-24 pt-14 sm:pb-28 sm:pt-20">
      <FadeIn className="flex flex-col items-start gap-5">
        <Avatar />
        <p className="inline-flex items-center gap-2.5 rounded-full border border-line px-3.5 py-2 font-mono text-[12.5px] text-muted">
          <span className="size-[7px] rounded-full bg-live" />
          Open to software engineering roles and freelance projects
        </p>
      </FadeIn>

      <FadeIn delay={0.08}>
        <h1
          id="hero-title"
          className="mt-9 max-w-[900px] font-serif text-[clamp(44px,7vw,84px)] leading-[1.02] tracking-[-0.015em]"
        >
          I build software people <em className="text-accent">rely on</em>:{" "}
          <RotatingWord words={["payments", "exams", "platforms"]} className="italic" />.
        </h1>
      </FadeIn>

      <FadeIn delay={0.16}>
        <p className="mt-7 max-w-[600px] text-lg leading-relaxed text-muted sm:text-[19px]">
          Software engineer in {site.location}. For {site.experience} I’ve designed, built and shipped full-stack web
          products with React, Next.js, TypeScript and Node.js, then stayed on to keep them running for real users.
        </p>
      </FadeIn>

      <FadeIn delay={0.24} className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
        <Button href="#work">View selected work</Button>
        <TextLink href="#contact">Get in touch</TextLink>
        <TextLink href={site.cvUrl} icon="download" download>
          Download CV
        </TextLink>
      </FadeIn>

      <FadeIn delay={0.28} className="mt-8">
        <AskChips />
      </FadeIn>

      <FadeIn delay={0.32}>
        <dl className="mt-20 grid grid-cols-2 gap-y-6 border-t border-line pt-5 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="pr-6">
              <dt className="font-mono text-[11.5px] tracking-[0.06em] text-muted">{f.label}</dt>
                           <dd className="mt-2 text-[15px]">
                {f.href ? (
                  <a href={f.href} className="underline decoration-line underline-offset-4 hover:decoration-ink">
                    {f.value}
                  </a>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </FadeIn>
    </section>
  );
}