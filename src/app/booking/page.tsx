"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { SERVICE_MODES, labelOf } from "@/lib/site";
import { URGENCY_LABEL, formatTW, money } from "@/lib/pricing";
import { isConfigured, supabase } from "@/lib/supabase";
import { PageHeader, Container } from "@/components/ui";
import BankInfo from "@/components/BankInfo";
import { PAYMENT_LABEL, STATUS_LABEL } from "@/lib/labels";

type Lookup = {
  booking_no: string;
  status: string;
  payment_status: string;
  urgency: keyof typeof URGENCY_LABEL;
  service_mode: string;
  preferred_slots: string[];
  confirmed_at: string | null;
  estimated_price: number;
  travel_fee: number | null;
  final_price: number | null;
  payment_method: "cash" | "transfer";
  bank_info: string | null;
};

const noSubscribe = () => () => {};
const readQueryNo = () => new URLSearchParams(window.location.search).get("no") ?? "";

export default function BookingLookupPage() {
  const queryNo = useSyncExternalStore(noSubscribe, readQueryNo, () => "");
  const [typedNo, setNo] = useState<string | null>(null);
  const no = typedNo ?? queryNo;
  const [last4, setLast4] = useState("");
  const [res, setRes] = useState<Lookup | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setRes(null);
    if (!isConfigured) return setMsg("示範模式：資料庫尚未連接，無法查詢。");
    setLoading(true);
    const { data, error } = await supabase().rpc("get_booking", { p_no: no, p_phone_last4: last4 });
    setLoading(false);
    if (error) return setMsg("查詢失敗，請稍後再試");
    if (!data) return setMsg("查無此預約，請確認編號與手機末 4 碼");
    setRes(data as Lookup);
  }

  return (
    <>
      <PageHeader title="查詢我的預約" lead="輸入預約編號與預約時留下的手機末 4 碼。" />
      <Container className="py-8">
        <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-[1.5fr_1fr_auto] sm:items-end">
          <label>
            <span className="mb-1 block font-semibold">預約編號</span>
            <input className="field font-mono uppercase" required value={no} onChange={(e) => setNo(e.target.value)} placeholder="NS260928-XXXX" />
          </label>
          <label>
            <span className="mb-1 block font-semibold">手機末 4 碼</span>
            <input className="field" required inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value)} />
          </label>
          <button disabled={loading} className="rounded-full bg-brand px-6 py-3 font-bold text-white disabled:opacity-60">
            {loading ? "查詢中…" : "查詢"}
          </button>
        </form>

        {msg && <p className="mt-4 rounded-xl bg-rush-soft px-4 py-3 text-rush">{msg}</p>}

        {res && (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xl font-bold">{res.booking_no}</p>
                <span className="rounded-full bg-brand-soft px-3 py-1 font-semibold text-brand-strong">{STATUS_LABEL[res.status]}</span>
              </div>
              <dl className="mt-4 space-y-2">
                <div className="flex gap-3"><dt className="w-20 text-muted">服務方式</dt><dd>{labelOf(SERVICE_MODES, res.service_mode)}{res.urgency === "rush" && "（急件）"}</dd></div>
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-muted">服務時間</dt>
                  <dd>{res.confirmed_at ? <strong>{formatTW(res.confirmed_at)}</strong> : `待確認（希望：${res.preferred_slots.map((s) => formatTW(s)).join("、")}）`}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-20 text-muted">金額</dt>
                  <dd>{res.final_price != null ? <strong>{money(res.final_price)}</strong> : `預估 ${money(res.estimated_price)} 起`}</dd>
                </div>
                <div className="flex gap-3"><dt className="w-20 text-muted">付款</dt><dd>{res.payment_method === "cash" ? "現金" : "匯款"}｜{PAYMENT_LABEL[res.payment_status]}</dd></div>
              </dl>
            </div>
            {res.payment_method === "transfer" && <BankInfo info={res.bank_info} />}
          </div>
        )}
      </Container>
    </>
  );
}
