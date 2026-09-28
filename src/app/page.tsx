import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { FAQ } from "@/lib/faq";
import { pageMeta } from "@/lib/seo";
import { CTA } from "@/components/ui";
import { Art, Doodle, Wave } from "@/components/Deco";

export const metadata: Metadata = pageMeta({ description: SITE.description, path: "/" });

const STEPS = [
  { art: "step-book", t: "線上預約", d: "填手術時間、地點和指甲狀況，1 分鐘就好。" },
  { art: "step-chat", t: "確認時間與費用", d: "我們用電話或 LINE 跟您確認時段、車馬費和金額。" },
  { art: "step-care", t: "到府／到院卸除", d: "溫和卸除不傷甲床，手腳一次處理乾淨。" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-5xl items-center gap-4 px-4 pb-8 pt-8 lg:grid-cols-[1fr_1.15fr] lg:gap-2 md:pb-14 md:pt-14">
          <div className="relative z-10">
            <div className="flex flex-wrap gap-2">
              <span className="sticker -rotate-2 bg-mint/60">台北・新北・桃園</span>
              <span className="sticker rotate-1 bg-butter">急件 OK ♡</span>
            </div>
            <h1 className="mt-5 text-[2.3rem] leading-[1.3] md:text-[3.1rem]">
              手術前的指甲，
              <br />
              交給我們<span className="squiggle">卸乾淨</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              麻醉前，醫院通常會請您卸掉指甲油、光療和水晶指甲。
              沒空、不方便出門、已經住院了？我們帶著工具箱去找您。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/book/" className="btn btn-peach text-lg">立即預約</Link>
              {SITE.lineUrl && <a href={SITE.lineUrl} className="btn btn-line text-lg">LINE 問問看</a>}
            </div>
            <div className="mt-7 inline-block -rotate-1 rounded-2xl border-2 border-dashed border-border bg-surface px-4 py-2.5">
              <span className="font-round text-lg">台北市 NT${SITE.basePrice.toLocaleString()} 起</span>
              <span className="mx-2 text-border">｜</span>
              <span className="text-muted">24 小時內急件 +{SITE.rushFee}</span>
            </div>
          </div>
          <Art name="hero-brand" eager sizes="(min-width: 1024px) 560px, (min-width: 768px) 720px, 100vw" alt="甲援美甲師提著工具箱出發，吉祥物小指甲在旁邊揮手" className="mx-auto w-full max-w-2xl lg:-mr-8 lg:max-w-none lg:scale-110" />
        </div>
      </section>

      {/* Why */}
      <Wave fill="var(--surface-2)" />
      <section className="bg-surface-2">
        <div className="mx-auto grid max-w-5xl items-center gap-6 px-4 py-10 md:grid-cols-[0.8fr_1.2fr] md:py-14">
          <Art name="oximeter" sizes="(min-width: 768px) 400px, 256px" alt="手指夾著血氧機" className="mx-auto w-64 rounded-[58%_42%_52%_48%/48%_56%_44%_52%] border-2 border-border md:w-full" />
          <div>
            <h2 className="text-[1.8rem] md:text-[2.2rem]">為什麼開刀前要卸甲？</h2>
            <ol className="mt-6 space-y-5">
              <li className="flex gap-4">
                <span className="font-round flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-peach text-xl">1</span>
                <div>
                  <p className="font-round text-xl">血氧機會量不準</p>
                  <p className="mt-1 leading-relaxed text-muted">麻醉時手指會夾血氧機，靠紅光穿過指甲量血氧。指甲油、光療可能擋住光，讓數字不準。</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-round flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-mint text-xl">2</span>
                <div>
                  <p className="font-round text-xl">看不到缺氧的警訊</p>
                  <p className="mt-1 leading-relaxed text-muted">缺氧時指甲床會變藍紫色，醫護人員靠它判斷狀況，彩繪會整個遮住。</p>
                </div>
              </li>
            </ol>
            <p className="mt-6 text-sm text-muted">
              資料來源：<a href={SITE.sourceUrl} target="_blank" rel="noopener" className="underline">{SITE.sourceName}</a>
              <Link href="/why/" className="font-round ml-3 text-base text-brand">看完整說明 →</Link>
            </p>
          </div>
        </div>
      </section>
      <Wave fill="var(--surface-2)" flip />

      {/* Modes */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center text-[1.8rem] md:text-[2.2rem]">我們去找您</h2>
        <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-10">
          <figure className="tape relative -rotate-2 rounded-md border border-border bg-surface p-3 pb-5 shadow-[0_6px_18px_rgba(74,52,40,0.10)]">
            <Art name="home" sizes="(min-width: 768px) 460px, 100vw" alt="美甲師到家裡幫奶奶卸指甲" className="aspect-[4/3] w-full rounded-sm object-cover" />
            <figcaption className="px-2 pt-4">
              <p className="font-round text-2xl">到府服務</p>
              <p className="mt-1 text-muted">在家就能處理好，長輩、行動不便的人不用出門。</p>
            </figcaption>
          </figure>
          <figure className="tape relative rotate-2 rounded-md border border-border bg-surface p-3 pb-5 shadow-[0_6px_18px_rgba(74,52,40,0.10)] md:mt-8">
            <Art name="hero" sizes="(min-width: 768px) 460px, 100vw" alt="美甲師到病房服務" className="aspect-[4/3] w-full rounded-sm object-cover object-[70%_50%]" />
            <figcaption className="px-2 pt-4">
              <p className="font-round text-2xl">到院病房</p>
              <p className="mt-1 text-muted">已經住院、明天就開刀？直接到病床邊幫您卸。</p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-4 pb-14">
        <h2 className="text-center text-[1.8rem] md:text-[2.2rem]">預約好簡單</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-2">
          {STEPS.map((s, i) => (
            <li key={s.t} className="contents">
              {i > 0 && <Doodle className="hidden w-16 self-center md:block" />}
              <div className="flex items-center gap-4 md:flex-col md:text-center">
                <Art name={s.art} sizes="(min-width: 768px) 144px, 96px" className="w-24 shrink-0 md:w-36" />
                <div>
                  <p className="font-round text-xl"><span className="text-brand">{i + 1}.</span> {s.t}</p>
                  <p className="mt-1 text-muted">{s.d}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Quick answers — the questions people most often type into search / AI assistants. */}
      <section className="mx-auto max-w-3xl px-4 pb-14">
        <h2 className="text-center text-[1.8rem] md:text-[2.2rem]">常見問題</h2>
        <dl className="mt-6 space-y-3">
          {FAQ.slice(0, 4).map(({ q, a }) => (
            <div key={q} className="paper px-5 py-4">
              <dt className="font-round text-lg">{q}</dt>
              <dd className="mt-2 leading-relaxed text-muted">{a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-center">
          <Link href="/faq/" className="font-round text-brand">看全部常見問題 →</Link>
        </p>
      </section>

      <div className="mx-auto max-w-4xl px-4">
        <CTA />
      </div>
    </>
  );
}
