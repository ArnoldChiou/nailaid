import type { Metadata } from "next";
import BookingForm from "./BookingForm";

export const metadata: Metadata = {
  title: "線上預約",
  description: "手術前卸甲線上預約：台北、新北、桃園到府與到院病房服務，全天候接急件。",
};

export default function BookPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      <h1 className="text-[1.9rem] font-bold">線上預約</h1>
      <p className="mt-2 text-muted">約 1 分鐘完成。送出後我們會以電話或 LINE 與您確認時間與金額。</p>
      <BookingForm />
    </div>
  );
}
