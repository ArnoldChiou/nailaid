"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { SITE } from "@/lib/site";
import { money } from "@/lib/pricing";
import { LAST_BOOKING_KEY, type BookingResult } from "../BookingForm";
import BankInfo from "@/components/BankInfo";
import { Art } from "@/components/Deco";

const noSubscribe = () => () => {};
function readLastBooking(): string | null {
  try {
    return sessionStorage.getItem(LAST_BOOKING_KEY);
  } catch {
    return null;
  }
}

export default function DonePage() {
  const raw = useSyncExternalStore(noSubscribe, readLastBooking, () => undefined);
  const b = useMemo<BookingResult | null | undefined>(() => {
    if (raw === undefined) return undefined;
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [raw]);

  if (b === undefined) return null;
  if (b === null) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-lg">找不到預約資料。</p>
        <Link href="/booking/" className="mt-4 inline-block text-brand underline">查詢我的預約</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="text-center">
        <Art name="done" eager sizes="160px" className="mx-auto w-40" />
        <h1 className="mt-4 text-[1.9rem] font-bold">預約已送出</h1>
        <p className="mt-2 text-muted">我們會盡快以電話或 LINE 與您確認時間與金額{b.urgency === "rush" && "，急件會優先處理"}。</p>
        {b.demo && <p className="mt-3 text-sm text-rush">（示範模式：此預約未被儲存）</p>}
      </div>

      <div className="mt-8 paper p-6">
        <p className="text-sm text-muted">預約編號</p>
        <p className="mt-1 font-mono text-3xl font-bold tracking-wider">{b.booking_no}</p>
        <p className="mt-2 text-sm text-muted">請截圖或記下編號，可用編號＋手機末 4 碼查詢預約狀態。</p>
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-sm text-muted">預估費用</p>
          <p className="text-2xl font-bold">{money(b.estimated_price)} 起</p>
          <p className="text-sm text-muted">
            {b.rush_fee > 0 && `含急件 ${money(b.rush_fee)}`}
            {b.city !== "taipei" && `${b.rush_fee > 0 ? "，" : ""}車馬費另計`}
            ，實際金額以確認時為準
          </p>
        </div>
      </div>

      {b.payment_method === "transfer" ? (
        <BankInfo info={b.bank_info} className="mt-4" />
      ) : (
        <p className="mt-4 rounded-2xl bg-surface-2 p-5">付款方式：<strong>現金</strong>，服務完成後當場付款。</p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {SITE.lineUrl && <a href={SITE.lineUrl} className="btn btn-line">加 LINE 好友</a>}
        <Link href="/" className="btn">回首頁</Link>
      </div>
    </div>
  );
}
