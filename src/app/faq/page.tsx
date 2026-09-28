import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { CTA, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "常見問題",
  description: "手術前卸甲常見問題：透明甲油要卸嗎？只卸手指可以嗎？可以到醫院病房嗎？",
};

const FAQ: [string, string][] = [
  ["為什麼一定要卸？", "麻醉時的血氧機要靠光線穿透指甲量測，指甲彩繪會讓數值失準；缺氧時指甲床變色的警訊也會被遮住。這是為了手術安全，詳細說明請見「為什麼要卸甲」頁面。"],
  ["透明或裸色的指甲油也要卸嗎？", "要。醫院通常要求所有指甲油、光療、水晶指甲都卸除，不論顏色。實際規定請以您的醫院指示為準。"],
  ["只卸手指可以嗎？", "建議手腳都卸。血氧機有時會夾在腳趾上，腳趾的彩繪同樣會影響量測。"],
  ["卸甲會傷指甲嗎？需要多久？", "我們用專業工具與方式溫和卸除，不硬撕、不硬剝。所需時間依指甲種類與指數而定，確認預約時會告訴您大約需要多久。"],
  ["可以到醫院病房服務嗎？", "可以。請在預約時填寫醫院與病房號，我們會配合醫院的訪客規定。"],
  ["最晚術前多久要卸？半夜也能來嗎？", "建議術前 1～3 天完成。真的來不及也可以預約急件，我們全天候接單（另有公告除外），24 小時內急件加收 NT$" + SITE.rushFee + "。"],
  ["新北、桃園的車馬費怎麼算？", "依距離另計，預約後我們會與您確認金額，您同意後才會安排。"],
  ["可以只卸、不做新的嗎？", "可以，我們就是專門處理術前卸甲。"],
  ["要怎麼付款？", "現金（服務完成後付款）或銀行匯款，匯款資訊會在預約成功後顯示。"],
  ["可以幫家人預約嗎？", "可以，預約時勾選「我是代家人預約」，並留下方便聯絡的電話即可。"],
];

export default function FaqPage() {
  return (
    <>
      <PageHeader eyebrow="常見問題" title="您可能想知道" />
      <Container className="space-y-3 py-10">
        {FAQ.map(([q, a]) => (
          <details key={q} className="group rounded-2xl border border-border bg-surface px-5 py-4 open:shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
              {q}
              <span className="text-brand transition group-open:rotate-45" aria-hidden>＋</span>
            </summary>
            <p className="mt-3 leading-relaxed text-muted">{a}</p>
          </details>
        ))}
        <div className="pt-8"><CTA /></div>
      </Container>
    </>
  );
}
