"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

export default function MobileActionBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/book") || pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t-2 border-dashed border-border bg-bg/95 px-3 pb-4 pt-3 backdrop-blur md:hidden">
      {SITE.lineUrl && (
        <a href={SITE.lineUrl} className="btn btn-line flex-1 px-3">
          LINE 詢問
        </a>
      )}
      {SITE.phone && (
        <a href={`tel:${SITE.phone}`} className="btn px-4" aria-label="撥打電話">
          電話
        </a>
      )}
      <Link href="/book/" className="btn btn-peach flex-[1.4] px-3">
        立即預約
      </Link>
    </div>
  );
}
