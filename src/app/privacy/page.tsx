import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "隱私權政策" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="隱私權政策與個人資料告知" />
      <Container className="prose-zh space-y-6 py-10">
        <section>
          <h2 className="text-xl font-bold">蒐集目的</h2>
          <p>僅用於安排與提供卸甲服務、聯絡確認預約、收款與客服。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold">蒐集項目</h2>
          <p>
            聯絡人姓名、手機、LINE ID（選填）、服務地址或醫院病房、手術日期時間、指甲狀況與照片（選填）。
            我們<strong>不會</strong>詢問病名、手術類型或身分證字號。
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold">保存期間</h2>
          <p>服務完成後保存 6 個月以處理售後與帳務，期滿後刪除或去識別化。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold">使用與保護</h2>
          <p>資料以加密連線傳輸，僅授權人員可存取，不會提供或出售給第三方。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold">您的權利</h2>
          <p>依個人資料保護法，您可隨時透過 LINE 或電話要求查詢、更正或刪除您的資料。</p>
        </section>
      </Container>
    </>
  );
}
