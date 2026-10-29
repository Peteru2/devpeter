import { site } from "@/data/site";
import { experience } from "@/data/experience";
import { FactList } from "@/components/ui/FactList";
import { FadeIn } from "@/components/ui/FadeIn";
import { TextLink } from "@/components/ui/Links";
import { Portrait } from "@/components/ui/Photo";
import { SectionHeader } from "@/components/ui/SectionHeader";

const facts = [
  { label: "Also known as", value: site.alternateNames.join(" · ") },
  { label: "Currently", value: `${site.currentRole.title}, ${site.currentRole.org}` },
  { label: "Based in", value: `${site.location} (WAT)` },
  { label: "Experience", value: `${site.experience} building production web software` },
  { label: "Education", value: "B.Sc. Computer Science" },
  { label: "Focus", value: site.focusAreas.join(" · ") },
  { label: "Open to", value: site.openTo },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="wrap pb-28">
      <SectionHeader id="about-title" index="02" label="About" title={`About ${site.name}`} />

      <div className="mt-14 grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
        <FadeIn>
          <Portrait />
          <p className="mt-4 font-mono text-xs text-muted">aka {site.handle}</p>
        </FadeIn>

        <div>
          <FadeIn className="max-w-[640px] space-y-4 text-[17px] leading-relaxed text-muted sm:text-lg">
            <p>
              <strong className="font-medium text-ink">{site.name}</strong>, known online as{" "}
              <strong className="font-medium text-ink">{site.handle}</strong>, is a software engineer
              based in {site.location}, currently {site.currentRole.title} at {site.currentRole.org}. With{" "}
              {site.experience} of building production web software and a B.Sc. in Computer Science, he builds full-stack
              products where reliability matters: payments, exams, and platforms people depend on every day.
            </p>
            <p>
              He is the solo developer behind <strong className="font-medium text-ink">Buydair</strong>, a
              payments-first wallet for airtime, data, electricity and TV subscriptions, funded through Paystack with
              webhook verification, automatic recovery of stuck purchases and audited refunds, and paired with free
              courses that teach people to recognise scams.
            </p>
            <p>
              At {site.currentRole.org} he built an{" "}
              <strong className="font-medium text-ink">offline computer-based testing system</strong> used by more than
              1,000 students. He also built the website and admin platform for{" "}
              <a
                href="https://twcglobal.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
              >
                True Worshippers Church
              </a>
              , where members stream and download sermons.
            </p>
            <p>
              Alongside building, he teaches: mentoring {site.teaching.students} students in{" "}
              {site.teaching.subjects.join(", ")}, from their first web page to shipping real projects. Explaining
              decisions every week keeps his own engineering clear and well reasoned.
            </p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <FactList items={facts} className="mt-10" />
          </FadeIn>

          <FadeIn delay={0.1} className="mt-10">
            <h3 className="font-mono text-xs tracking-[0.06em] text-muted">EXPERIENCE</h3>
            <ol className="mt-3 border-t border-line">
              {experience.map((role) => (
                <li
                  key={`${role.when}-${role.org}`}
                  className="grid gap-2 border-b border-line py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4"
                >
                  <span className="pt-0.5 font-mono text-xs text-muted">{role.when}</span>
                  <div>
                    <p className="font-medium">
                      {role.title}
                      <span className="font-normal text-muted">
                        {" "}
                        · {role.org}
                        {role.location ? `, ${role.location}` : ""}
                      </span>
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {role.points.map((point) => (
                        <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                          <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-muted" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </FadeIn>

      

          <FadeIn delay={0.16} className="mt-8">
            <TextLink href={site.cvUrl} icon="download" download>
              Download full CV
            </TextLink>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}