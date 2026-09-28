import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { CTA, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "服務與價格",
  description: `手術前卸甲服務價格：台北市 NT$${SITE.basePrice} 起，24 小時內急件加 NT$${SITE.rushFee}，新北、桃園依距離酌收車馬費。`,
};

const ROWS = [
  { item: "卸甲服務（台北市）", price: `NT$${SITE.basePrice.toLocaleString()} 起`, note: "依部位、指甲種類與指數報價" },
  { item: "急件", price: `+NT$${SITE.rushFee}`, note: "服務時間距手術或距預約當下 24 小時內" },
  { item: "新北市車馬費", price: "依距離另計", note: "預約後與您確認" },
  { item: "桃園市車馬費", price: "依距離另計", note: "預約後與您確認" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader eyebrow="服務與價格" title="透明報價，確認後才出發" lead="網站上顯示的是預估價，實際金額會在確認預約時告訴您，您同意後才安排服務。" />
      <Container className="space-y-10 py-10">
        <section>
          <h2 className="text-2xl font-bold">價格</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
            {ROWS.map((r) => (
              <div key={r.item} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border px-5 py-4 last:border-0">
                <div>
                  <p className="font-semibold">{r.item}</p>
                  <p className="text-sm text-muted">{r.note}</p>
                </div>
                <p className="text-lg font-bold text-brand-strong">{r.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">服務內容</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["卸除種類", "一般甲油、光療凝膠、水晶／延甲、甲片、鑽飾"],
              ["部位", "手、腳，或手腳一起"],
              ["服務方式", "到府、到院病房（目前無店面）"],
              ["服務時間", "全天候，含夜間與假日（另有公告除外）"],
            ].map(([k, v]) => (
              <li key={k} className="rounded-xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold text-brand">{k}</p>
                <p className="mt-1">{v}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">付款方式</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold">現金</p>
              <p className="mt-1 text-muted">服務完成後當場付款。</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="font-semibold">銀行匯款</p>
              <p className="mt-1 text-muted">預約成功後會顯示匯款資訊。</p>
            </div>
          </div>
        </section>

        <CTA />
      </Container>
    </>
  );
}
