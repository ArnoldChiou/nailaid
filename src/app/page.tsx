import Link from "next/link";
import { SITE } from "@/lib/site";
import { CTA } from "@/components/ui";
import OximeterDiagram from "@/components/OximeterDiagram";

const STEPS = [
  { t: "線上預約", d: "填寫手術時間、地點與指甲狀況，1 分鐘完成。" },
  { t: "確認時間與費用", d: "我們以電話或 LINE 與您確認時段、車馬費與總金額。" },
  { t: "到府／到院卸除", d: "專業工具溫和卸除，不傷甲床，手腳一次處理乾淨。" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-surface-2">
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-12 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <p className="mb-3 inline-block rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-strong">
              台北・新北・桃園｜全天候接急件
            </p>
            <h1 className="text-[2.1rem] font-bold leading-[1.25] md:text-5xl">
              手術前指甲卸除，
              <br />
              <span className="text-brand">到府、到院</span>都可以
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              麻醉前醫院會要求卸除所有指甲油、光療與水晶指甲。
              沒時間、行動不便、已經住院？指安直接到您身邊處理。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/book/" className="rounded-full bg-brand px-7 py-3.5 text-lg font-bold text-white hover:bg-brand-strong">
                立即預約
              </Link>
              {SITE.lineUrl && (
                <a href={SITE.lineUrl} className="rounded-full bg-line px-7 py-3.5 text-lg font-bold text-white">
                  LINE 詢問
                </a>
              )}
              <Link href="/why/" className="rounded-full border border-border bg-surface px-6 py-3.5 text-lg font-semibold">
                為什麼要卸？
              </Link>
            </div>
            <p className="mt-5 text-muted">
              台北市 <strong className="text-ink">NT${SITE.basePrice.toLocaleString()} 起</strong>
              <span className="mx-2 text-border">|</span>
              24 小時內急件 +NT${SITE.rushFee}
            </p>
          </div>
          <OximeterDiagram />
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold md:text-3xl">為什麼手術前一定要卸甲？</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-lg font-bold">① 血氧機會量不準</p>
            <p className="mt-2 leading-relaxed text-muted">
              麻醉時會用夾在手指上的血氧機，以紅光穿透指甲量測血氧。甲油、光療會吸收光線，
              讓數值失準或延遲警報。
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-lg font-bold">② 看不到缺氧警訊</p>
            <p className="mt-2 leading-relaxed text-muted">
              缺氧時指甲床會變成藍紫色（發紺），醫護人員靠它判斷狀況。指甲彩繪會把這個警訊完全遮住。
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">
          資料來源：
          <a href={SITE.sourceUrl} target="_blank" rel="noopener" className="underline">
            {SITE.sourceName}
          </a>
          。<Link href="/why/" className="ml-1 font-semibold text-brand">看完整說明 →</Link>
        </p>
      </section>

      {/* Modes */}
      <section className="bg-surface-2">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-2xl font-bold md:text-3xl">我們到您身邊</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-surface p-6">
              <p className="text-3xl" aria-hidden>🏠</p>
              <p className="mt-2 text-xl font-bold">到府服務</p>
              <p className="mt-2 text-muted">手術前在家就能處理好，長輩、行動不便者不用出門。</p>
            </div>
            <div className="rounded-2xl bg-surface p-6">
              <p className="text-3xl" aria-hidden>🏥</p>
              <p className="mt-2 text-xl font-bold">到院病房</p>
              <p className="mt-2 text-muted">已經住院、明天就要開刀？直接到病房床邊卸除。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold md:text-3xl">預約流程</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-2xl border border-border bg-surface p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-bold text-white">{i + 1}</span>
              <p className="mt-3 text-lg font-bold">{s.t}</p>
              <p className="mt-1 text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="mx-auto max-w-5xl px-4">
        <CTA />
      </div>
    </>
  );
}
