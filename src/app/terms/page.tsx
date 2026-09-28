import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = pageMeta({
  title: "服務條款",
  description: "甲援手術前卸甲服務條款：預約確認、報價、急件加價、改期取消與到院服務須知。",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <>
      <PageHeader title="服務條款" />
      <Container className="prose-zh py-10">
        <ol className="list-decimal space-y-3 pl-5">
          <li>線上送出預約後，需經我們以電話或 LINE 確認時間與金額，預約才算成立。</li>
          <li>網站顯示金額為預估價，實際金額依指甲種類、指數、車馬費等，於確認時告知。</li>
          <li>服務時間距手術或距預約當下 24 小時內，屬急件，加收 NT${SITE.rushFee}。</li>
          <li>如需改期或取消，請盡早以 LINE 或電話通知。</li>
          <li>到院服務需遵守醫院規定，如因院方規定無法進入，我們會與您另行協調。</li>
          <li>本服務為指甲卸除，不涉及任何醫療行為；術前準備請依醫院指示。</li>
        </ol>
      </Container>
    </>
  );
}
