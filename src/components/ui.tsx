import Link from "next/link";
import type { ReactNode } from "react";
import { Art, Wave } from "./Deco";

export function PageHeader({ eyebrow, title, lead, art = "mascot" }: { eyebrow?: string; title: string; lead?: ReactNode; art?: string }) {
  return (
    <section>
      <div className="bg-surface-2">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 pb-6 pt-10 md:pb-8 md:pt-14">
          <div className="min-w-0 flex-1">
            {eyebrow && <p className="sticker mb-3 bg-butter">{eyebrow}</p>}
            <h1 className="text-[2rem] leading-tight md:text-[2.6rem]">{title}</h1>
            {lead && <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>}
          </div>
          <Art name={art} sizes="160px" className={`hidden w-32 shrink-0 sm:block md:w-40 ${art === "oximeter" ? "rounded-[58%_42%_52%_48%/48%_56%_44%_52%]" : ""}`} />
        </div>
      </div>
      <Wave fill="var(--surface-2)" flip />
    </section>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-3xl px-4 ${className}`}>{children}</div>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`paper p-5 md:p-6 ${className}`}>{children}</div>;
}

export function CTA({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center gap-4 rounded-[36px] border-2 border-ink bg-butter px-6 pb-8 pt-6 text-center sm:flex-row sm:text-left md:px-10 ${className}`}>
      <Art name="mascot" sizes="128px" className="w-28 shrink-0 md:w-32" />
      <div className="flex-1">
        <p className="font-round text-2xl md:text-[1.7rem]">手術快到了？交給我們！</p>
        <p className="mt-1 text-ink/80">台北・新北・桃園，到府或到院病房，全天候接急件。</p>
      </div>
      <Link href="/book/" className="btn btn-peach shrink-0 text-lg">線上預約 →</Link>
    </div>
  );
}
