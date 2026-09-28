import type { Metadata, Viewport } from "next";
import { Huninn } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { businessSchema, websiteSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NoticeBar from "@/components/NoticeBar";
import MobileActionBar from "@/components/MobileActionBar";

// jf open 粉圓 — rounded, friendly face for headings and buttons.
const huninn = Huninn({ weight: "400", subsets: ["latin"], variable: "--font-huninn", preload: false });

// Defaults only — no canonical/og:url here, or every page would inherit the homepage's.
// Each public page sets its own via pageMeta().
const { openGraph, twitter } = pageMeta({ description: SITE.description, path: "/" });

export const metadata: Metadata = {
  description: SITE.description,
  openGraph: { ...openGraph, url: undefined },
  twitter,
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} ${SITE.nameEn}｜手術前指甲卸除・到府到院`,
    template: `%s｜${SITE.name} ${SITE.nameEn}`,
  },
  applicationName: `${SITE.name} ${SITE.nameEn}`,
  keywords: [
    "手術前卸甲", "術前卸指甲", "開刀前卸光療", "手術前卸指甲油", "住院卸指甲", "病房卸甲",
    "到府卸甲", "到院卸甲", "台北卸甲", "新北卸甲", "桃園卸甲", "卸光療", "卸水晶指甲",
  ],
  formatDetection: { telephone: true },
  // Google Search Console (same token is also a DNS TXT record on nailaid.nordchiou.com).
  verification: { google: "-p6L4GAaXc3dZ7VYhPYLwA045PqRamo1JJp_SSyzrfI" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
};

export const viewport: Viewport = { themeColor: "#fff6e9" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant-TW" className={`${huninn.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={[businessSchema(), websiteSchema()]} />
        <NoticeBar />
        <SiteHeader />
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
        <SiteFooter />
        <MobileActionBar />
      </body>
    </html>
  );
}
