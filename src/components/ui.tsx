import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: ReactNode }) {
  return (
    <section className="border-b border-border bg-surface-2">
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        {eyebrow && <p className="mb-2 text-sm font-semibold tracking-wider text-brand">{eyebrow}</p>}
        <h1 className="text-[1.9rem] font-bold leading-tight md:text-4xl">{title}</h1>
        {lead && <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>}
      </div>
    </section>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-3xl px-4 ${className}`}>{children}</div>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-surface p-5 md:p-6 ${className}`}>{children}</div>;
}

export function CTA({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl bg-brand p-6 text-white md:p-8 ${className}`}>
      <p className="text-xl font-bold md:text-2xl">手術快到了？現在就預約</p>
      <p className="mt-2 text-white/85">台北・新北・桃園，到府或到院病房，全天候接急件。</p>
      <Link href="/book/" className="mt-5 inline-block rounded-full bg-white px-6 py-3 font-bold text-brand-strong hover:bg-brand-soft">
        線上預約 →
      </Link>
    </div>
  );
}
