import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  const base = site.url || "http://localhost:3000";
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}