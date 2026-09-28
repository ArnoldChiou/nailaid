import type { Metadata } from "next";
import { CITIES } from "@/lib/site";
import { CTA, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "服務範圍",
  description: "指安提供台北市、新北市、桃園市到府與到院病房卸甲服務。",
};

export default function AreaPage() {
  return (
    <>
      <PageHeader art="step-book" eyebrow="服務範圍" title="台北・新北・桃園" lead="到府或到院病房服務。其他地區歡迎先用 LINE 或電話詢問。" />
      <Container className="space-y-10 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {CITIES.map((c) => (
            <div key={c.id} className="paper p-5">
              <p className="text-xl">{c.name}</p>
              <p className="mt-1 text-muted">{c.travel}</p>
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <h2 className="text-2xl">到院病房服務須知</h2>
          <ul className="list-disc space-y-2 pl-5 leading-relaxed">
            <li>預約時請填寫醫院名稱與病房號（不確定可先填醫院，之後再告訴我們）。</li>
            <li>部分醫院有探病時間或訪客人數限制，我們會配合院方規定，必要時請家屬協助接應。</li>
            <li>若病人正在打點滴、行動不便，請在備註說明，我們會調整服務方式。</li>
          </ul>
        </section>

        <CTA />
      </Container>
    </>
  );
}
