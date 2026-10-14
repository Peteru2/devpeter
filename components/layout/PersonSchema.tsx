import { site } from "@/data/site";

export function PersonSchema() {
  const sameAs = Object.values(site.socials).filter((url) => !url.includes("TODO"));
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.alternateNames,
    jobTitle: site.role,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "NG" },
    knowsAbout: site.focusAreas,
    ...(sameAs.length ? { sameAs } : {}),
    ...(site.url ? { url: site.url } : {}),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}