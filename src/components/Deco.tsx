import { asset } from "@/lib/asset";
import ART from "@/lib/art.json";

type ArtName = keyof typeof ART;
type ArtInfo = { w: number; h: number; widths: number[]; lqip: string | null };

/**
 * Responsive illustration: the browser picks AVIF (or WebP) at the smallest width that
 * covers `sizes`, so phones download a fraction of the desktop file.
 */
export function Art({
  name, alt = "", className = "", sizes = "100vw", eager = false,
}: { name: string; alt?: string; className?: string; sizes?: string; eager?: boolean }) {
  const info = ART[name as ArtName] as ArtInfo;
  const set = (ext: string) => info.widths.map((w) => `${asset(`/art/${name}-${w}.${ext}`)} ${w}w`).join(", ");
  const largest = info.widths[info.widths.length - 1];
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <img
        src={asset(`/art/${name}-${largest}.webp`)}
        srcSet={set("webp")}
        sizes={sizes}
        width={info.w}
        height={info.h}
        alt={alt}
        // width/height attrs reserve space; h-auto keeps the ratio unless a fixed height is given.
        className={`art ${/(^|\s)h-/.test(className) ? "" : "h-auto"} ${className}`}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        style={info.lqip ? { backgroundImage: `url(${info.lqip})`, backgroundSize: "cover" } : undefined}
      />
    </picture>
  );
}

/** Wavy edge between sections; `fill` is the colour of the section it leads into. */
export function Wave({ fill = "var(--surface-2)", flip = false, className = "" }: { fill?: string; flip?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true" className={`block h-6 w-full md:h-10 ${flip ? "rotate-180" : ""} ${className}`}>
      <path d="M0 40 V22 C150 2 300 38 450 20 S750 2 900 20 S1100 36 1200 16 V40 Z" fill={fill} />
    </svg>
  );
}

/** Loose hand-drawn arrow used between steps. */
export function Doodle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 30" aria-hidden="true" className={className} fill="none" stroke="var(--muted)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="4 5">
      <path d="M4 20 C24 4 50 4 72 16" />
      <path d="M64 8 L73 16 L62 21" strokeDasharray="none" />
    </svg>
  );
}
