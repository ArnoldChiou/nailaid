"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, SITE } from "@/lib/site";
import Logo from "./Logo";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-16 border-t border-border bg-surface-2">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 text-muted">{SITE.tagline}</p>
          <p className="mt-2 text-sm text-muted">服務區域：台北市、新北市、桃園市</p>
          <p className="mt-2 text-sm text-muted">
            電話 <a href={`tel:${SITE.phone}`} className="underline">{SITE.phone}</a>
            <span className="mx-2">|</span>
            LINE <a href={SITE.lineUrl} className="underline">{SITE.lineId}</a>
          </p>
        </div>
        <ul className="space-y-2 text-[0.95rem]">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="text-muted hover:text-ink">{n.label}</Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-2 text-[0.95rem]">
          <li><Link href="/book/" className="text-muted hover:text-ink">線上預約</Link></li>
          <li><Link href="/booking/" className="text-muted hover:text-ink">查詢我的預約</Link></li>
          <li><Link href="/about/" className="text-muted hover:text-ink">關於指安</Link></li>
          <li><Link href="/privacy/" className="text-muted hover:text-ink">隱私權政策</Link></li>
          <li><Link href="/terms/" className="text-muted hover:text-ink">服務條款</Link></li>
        </ul>
      </div>
      <p className="border-t border-border px-4 py-4 text-center text-xs text-muted">
        本站衛教內容僅供參考，實際術前準備請依主治醫師及醫院指示。© {new Date().getFullYear()} {SITE.name} {SITE.nameEn}
      </p>
    </footer>
  );
}
