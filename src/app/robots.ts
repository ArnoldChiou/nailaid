import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

// Search engines and AI answer engines (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…)
// are all welcome on public pages; the admin area and per-customer pages are excluded.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/book/done/", "/booking/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
