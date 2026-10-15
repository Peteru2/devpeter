import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { caseStudies } from "@/data/caseStudies";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url || "http://localhost:3000";
  const studies = projects
    .filter((p) => p.hasCaseStudy && caseStudies[p.slug])
    .map((p) => ({ url: `${base}/work/${p.slug}`, priority: 0.8 }));

  return [{ url: base, priority: 1 }, { url: `${base}/work`, priority: 0.9 }, ...studies];
}