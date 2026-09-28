import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

// Everything is crawlable, including by AI answer engines (GPTBot, ClaudeBot, PerplexityBot,
// Google-Extended…). Private pages (/admin/, /booking/, /book/done/) are kept out of results with
// a noindex meta tag instead of Disallow — a blocked page's noindex can never be read.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
