"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site";
import Logo from "./Logo";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" onClick={() => setOpen(false)} aria-label="指安 首頁">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-[0.95rem] text-muted hover:text-ink">
              {n.label}
            </Link>
          ))}
          <Link href="/book/" className="rounded-full bg-brand px-5 py-2 font-semibold text-white hover:bg-brand-strong">
            立即預約
          </Link>
        </nav>

        <button
          className="-mr-2 p-2 md:hidden"
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-bg px-4 pb-4 md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-b border-border py-3.5 text-lg">
              {n.label}
            </Link>
          ))}
          <Link href="/booking/" onClick={() => setOpen(false)} className="block py-3.5 text-lg text-muted">
            查詢我的預約
          </Link>
        </nav>
      )}
    </header>
  );
}
