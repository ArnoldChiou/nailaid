/* eslint-disable @next/next/no-img-element -- static export serves pre-optimized WebP */
import { asset } from "@/lib/asset";

export function Art({ name, alt = "", className = "", eager = false }: { name: string; alt?: string; className?: string; eager?: boolean }) {
  return <img src={asset(`/art/${name}.webp`)} alt={alt} className={`art ${className}`} loading={eager ? "eager" : "lazy"} decoding="async" />;
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
