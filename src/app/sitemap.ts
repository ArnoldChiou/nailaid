import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const PAGES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, freq: "weekly" },
  { path: "/why/", priority: 0.9, freq: "monthly" },
  { path: "/services/", priority: 0.9, freq: "monthly" },
  { path: "/faq/", priority: 0.8, freq: "monthly" },
  { path: "/area/", priority: 0.7, freq: "monthly" },
  { path: "/book/", priority: 0.8, freq: "monthly" },
  { path: "/contact/", priority: 0.6, freq: "yearly" },
  { path: "/about/", priority: 0.5, freq: "yearly" },
  { path: "/privacy/", priority: 0.2, freq: "yearly" },
  { path: "/terms/", priority: 0.2, freq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE.url}${p.path}`,
    lastModified: SITE.updated,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
