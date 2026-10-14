import { services } from "@/data/services";
import { FadeIn } from "@/components/ui/FadeIn";
import { Icon } from "@/components/ui/Icon";
import { TextLink } from "@/components/ui/Links";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="wrap pb-28">
      <SectionHeader
        id="services-title"
        index="04"
        label="Services"
        title="Ways we can work together."
        action={<p className="max-w-[300px] text-[15px] text-muted">Open to freelance projects as well as full-time roles.</p>}
      />

      <div className="mt-14 grid gap-y-14 lg:grid-cols-3 lg:divide-x lg:divide-line">
        {services.map((s, i) => (
          <FadeIn
            key={s.slug}
            delay={i * 0.08}
            className={`flex flex-col lg:px-10 ${i === 0 ? "lg:pl-0" : ""} ${i === services.length - 1 ? "lg:pr-0" : ""}`}
          >
            <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 font-serif text-[30px] leading-tight">{s.title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{s.forWho}</p>

            <div className="mt-6 border-y border-line py-4">
              <p className="text-xl font-medium">{s.price ?? "Custom quote"}</p>
              <p className="mt-1 font-mono text-xs text-muted">{s.priceNote ?? "Priced after a short call"}</p>
            </div>

            <ul className="mt-6 space-y-2.5">
              {s.includes.map((item) => (
                <li key={item} className="flex gap-2.5 text-[15px]">
                  <Icon name="check" className="mt-1 size-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>

            {s.proof && <p className="mt-6 font-serif text-lg italic text-muted">{s.proof}</p>}

            <div className="mt-auto pt-8">
              <TextLink href={`/?service=${s.slug}#contact`} icon="arrow">
                {s.cta}
              </TextLink>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}