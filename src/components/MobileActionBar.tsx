"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

export default function MobileActionBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/book") || pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-border bg-surface/95 p-3 backdrop-blur md:hidden">
      {SITE.lineUrl && (
        <a href={SITE.lineUrl} className="flex-1 rounded-full bg-line py-3 text-center font-semibold text-white">
          LINE 詢問
        </a>
      )}
      {SITE.phone && (
        <a href={`tel:${SITE.phone}`} className="rounded-full border border-border px-5 py-3 font-semibold" aria-label="撥打電話">
          電話
        </a>
      )}
      <Link href="/book/" className="flex-[1.4] rounded-full bg-brand py-3 text-center font-semibold text-white">
        立即預約
      </Link>
    </div>
  );
}
