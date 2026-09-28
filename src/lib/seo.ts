import type { Metadata } from "next";
import { SITE } from "./site";

const OG_IMAGE = { url: SITE.ogImage, width: 1200, height: 630, alt: `${SITE.name} ${SITE.nameEn}：美甲師與吉祥物出發服務` };

/**
 * Per-page metadata with canonical URL and a complete Open Graph block.
 * (Next replaces a parent's openGraph object instead of merging it, so every page sets it fully.)
 */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const fullTitle = title ? `${title}｜${SITE.name} ${SITE.nameEn}` : `${SITE.name} ${SITE.nameEn}｜${SITE.tagline}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      siteName: `${SITE.name} ${SITE.nameEn}`,
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [SITE.ogImage] },
  };
}

/** For utility pages that should not appear in search results. */
export const noIndex: Metadata = { robots: { index: false, follow: true } };
