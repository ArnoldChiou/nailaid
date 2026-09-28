import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NoticeBar from "@/components/NoticeBar";
import MobileActionBar from "@/components/MobileActionBar";

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} ${SITE.nameEn}｜手術前指甲卸除・到府到院`,
    template: `%s｜${SITE.name} ${SITE.nameEn}`,
  },
  description: SITE.description,
  keywords: ["手術前卸甲", "術前卸光療", "住院卸指甲", "到府卸甲", "到院卸甲", "台北卸甲", "新北卸甲", "桃園卸甲"],
};

export const viewport: Viewport = { themeColor: "#2f7d74" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant-TW" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <NoticeBar />
        <SiteHeader />
        <main className="flex-1 pb-24 md:pb-0">{children}</main>
        <SiteFooter />
        <MobileActionBar />
      </body>
    </html>
  );
}
