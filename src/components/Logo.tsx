import { SITE } from "@/lib/site";
import { Art } from "./Deco";

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return <Art name="mascot" eager sizes="40px" className={className} />;
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
