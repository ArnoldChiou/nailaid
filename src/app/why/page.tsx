import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { CTA, Container, PageHeader } from "@/components/ui";
import OximeterDiagram from "@/components/OximeterDiagram";

export const metadata: Metadata = {
  title: "為什麼手術前要卸甲",
  description: "麻醉前為什麼要卸除指甲油、光療與水晶指甲？血氧機量測與發紺觀察的原理說明。",
};

const MUST_REMOVE = ["一般指甲油（含透明、裸色）", "光療凝膠指甲", "水晶指甲、延甲", "甲片、貼片", "鑽飾、亮片等裝飾"];

export default function WhyPage() {
  return (
    <>
      <PageHeader art="oximeter"
        eyebrow="術前衛教"
        title="為什麼手術前要卸除指甲彩繪？"
        lead="這不是美觀問題，而是手術與麻醉安全。醫院會要求手、腳的指甲彩繪都要在入院前卸除乾淨。"
      />
      <Container className="prose-zh space-y-10 py-10">
        <section>
          <h2 className="text-2xl">① 血氧機需要「看穿」指甲</h2>
          <p className="mt-3">
            手術與麻醉過程中，麻醉醫師會用「脈搏血氧儀」夾在手指或腳趾上，持續監測血液中的氧氣濃度。
            它的原理是讓紅光與紅外光穿透指甲與甲床，再由另一側的感應器接收。
          </p>
          <p className="mt-3">
            深色或鮮豔的指甲油、光療凝膠會<strong>阻擋或吸收光線</strong>，
            讓血氧數值不準確，甚至在血氧下降時<strong>延遲發出警報</strong>。
          </p>
          <div className="mt-5"><OximeterDiagram /></div>
        </section>

        <section>
          <h2 className="text-2xl">② 指甲床是缺氧的警示燈</h2>
          <p className="mt-3">
            當身體缺氧時，指甲床會出現藍紫色的變化（醫學上稱為「發紺」），這是醫護人員判斷末梢循環與氧合狀態的重要依據。
            指甲彩繪會把這個警訊<strong>完全遮蓋</strong>。
          </p>
        </section>

        <section className="paper border-rush/30 bg-rush-soft p-5">
          <h2 className="text-xl text-rush">可能的風險</h2>
          <p className="mt-2">
            若血氧已經下降、儀器卻因干擾沒能及時警示，可能延誤處置的黃金時間。
          </p>
        </section>

        <section>
          <h2 className="text-2xl">需要卸除哪些？</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {MUST_REMOVE.map((m) => (
              <li key={m} className="flex gap-2 paper px-4 py-3">
                <span className="text-brand">✓</span>{m}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <strong>手指和腳趾都要卸。</strong>
            血氧機有時會夾在腳趾，只卸手指是不夠的。
          </p>
        </section>

        <section>
          <h2 className="text-2xl">什麼時候卸？可以自己卸嗎？</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>建議在<strong>手術前 1～3 天內</strong>完成，避免臨時找不到人處理。</li>
            <li>一般指甲油可用去光水自行清除乾淨。</li>
            <li>
              光療、水晶指甲需要專業工具與方式卸除，<strong>請勿硬撕或硬剝</strong>，
              容易傷害甲床，術後也可能增加感染風險。
            </li>
          </ul>
        </section>

        <p className="paper bg-surface-2 p-4 text-sm text-muted">
          本頁內容整理自
          <a href={SITE.sourceUrl} target="_blank" rel="noopener" className="mx-1 underline">{SITE.sourceName}</a>
          ，僅供一般參考。每家醫院與每位病人的術前準備不同，請以主治醫師及醫院的指示為準。
        </p>

        <CTA />
      </Container>
    </>
  );
}
