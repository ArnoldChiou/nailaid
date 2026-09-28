import { SITE } from "@/lib/site";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  // A fingertip with a bare nail and a small check — "nail cleared, safe".
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--brand)" />
      <path d="M10 27V12a6 6 0 0 1 12 0v15" fill="#fff" />
      <path d="M12.5 12.5a3.5 3.5 0 0 1 7 0V16h-7z" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1" />
      <path d="M13.5 21l2 2 3.5-4" fill="none" stroke="var(--brand)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="flex items-center gap-2">
      <LogoMark />
      <span className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold tracking-wide text-ink">{SITE.name}</span>
        <span className="text-sm font-semibold tracking-wider text-brand">{SITE.nameEn}</span>
      </span>
    </span>
  );
}
