/* eslint-disable @next/next/no-img-element */
import { SITE } from "@/lib/site";
import { asset } from "@/lib/asset";

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return <img src={asset("/art/mascot.webp")} alt="" className={`art ${className}`} />;
}

export default function Logo() {
  return (
    <span className="flex items-center gap-1.5">
      <LogoMark />
      <span className="flex items-baseline gap-1.5">
        <span className="font-round text-2xl text-ink">{SITE.name}</span>
        <span className="font-round text-sm tracking-wider text-brand">{SITE.nameEn}</span>
      </span>
    </span>
  );
}
