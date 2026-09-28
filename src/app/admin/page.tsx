"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BODY_PARTS, CITIES, NAIL_TYPES, SERVICE_MODES, labelOf } from "@/lib/site";
import { URGENCY_LABEL, formatTW, money, type Urgency } from "@/lib/pricing";
import { PAYMENT_LABEL, STATUS_LABEL } from "@/lib/labels";
import { PHOTO_BUCKET, supabase } from "@/lib/supabase";

type Booking = {
  id: string;
  booking_no: string;
  status: string;
  payment_status: string;
  urgency: Urgency;
  service_mode: string;
  body_parts: string;
  nail_types: string[];
  nail_count: number | null;
  photo_paths: string[];
  surgery_at: string;
  preferred_slots: string[];
  confirmed_at: string | null;
  city: string;
  address: string | null;
  hospital_name: string | null;
  ward_room: string | null;
  contact_name: string;
  phone: string;
  line_id: string | null;
  is_proxy: boolean;
  payment_method: string;
  note: string | null;
  estimated_price: number;
  rush_fee: number;
  travel_fee: number | null;
  final_price: number | null;
  admin_note: string | null;
  created_at: string;
};

const FILTERS = [
  { id: "open", label: "待處理", match: (b: Booking) => b.status === "new" || b.status === "confirmed" },
  { id: "new", label: "待確認", match: (b: Booking) => b.status === "new" },
  { id: "confirmed", label: "已確認", match: (b: Booking) => b.status === "confirmed" },
  { id: "closed", label: "已結案", match: (b: Booking) => ["done", "declined", "cancelled"].includes(b.status) },
  { id: "all", label: "全部", match: () => true },
];

const URGENCY_STYLE: Record<Urgency, string> = {
  rush: "bg-rush text-white",
  priority: "bg-accent-soft text-ink",
  normal: "bg-surface-2 text-muted",
};

async function fetchBookings() {
  const { data } = await supabase().from("bookings").select("*").order("created_at", { ascending: false }).limit(300);
  return (data as Booking[]) ?? [];
}

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("open");
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setRows(await fetchBookings());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings().then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const shown = useMemo(() => {
    const m = FILTERS.find((f) => f.id === filter)!.match;
    const rank = { rush: 0, priority: 1, normal: 2 };
    return rows.filter(m).sort((a, b) =>
      filter === "open"
        ? rank[a.urgency] - rank[b.urgency] || +new Date(a.surgery_at) - +new Date(b.surgery_at)
        : 0,
    );
  }, [rows, filter]);

  const counts = Object.fromEntries(FILTERS.map((f) => [f.id, rows.filter(f.match).length]));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-2 text-[0.95rem] ${filter === f.id ? "bg-ink text-white" : "border border-border bg-surface"}`}>
            {f.label} <span className="opacity-70">{counts[f.id]}</span>
          </button>
        ))}
        <button onClick={load} className="ml-auto text-sm text-brand underline">重新整理</button>
      </div>

      {loading ? (
        <p className="mt-8 text-muted">載入中…</p>
      ) : shown.length === 0 ? (
        <p className="mt-8 text-muted">沒有訂單。</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {shown.map((b) => (
            <li key={b.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              <button onClick={() => setOpenId(openId === b.id ? null : b.id)} className="grid w-full gap-1 px-4 py-3 text-left md:grid-cols-[auto_1fr_auto] md:items-center md:gap-4">
                <span className="flex items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${URGENCY_STYLE[b.urgency]}`}>{URGENCY_LABEL[b.urgency]}</span>
                  <span className="font-mono text-sm">{b.booking_no}</span>
                </span>
                <span className="min-w-0 truncate">
                  <strong>{b.contact_name}</strong>
                  <span className="text-muted">｜{labelOf(SERVICE_MODES, b.service_mode)}・{labelOf(CITIES, b.city)}｜手術 {formatTW(b.surgery_at)}</span>
                </span>
                <span className="text-sm">
                  <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-brand-strong">{STATUS_LABEL[b.status]}</span>
                  <span className="ml-2 text-muted">{PAYMENT_LABEL[b.payment_status]}</span>
                </span>
              </button>
              {openId === b.id && <Detail b={b} onSaved={load} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Detail({ b, onSaved }: { b: Booking; onSaved: () => void }) {
  const toLocal = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const [status, setStatus] = useState(b.status);
  const [paymentStatus, setPaymentStatus] = useState(b.payment_status);
  const [confirmedAt, setConfirmedAt] = useState(toLocal(b.confirmed_at));
  const [travelFee, setTravelFee] = useState(b.travel_fee?.toString() ?? "");
  const [finalPrice, setFinalPrice] = useState(b.final_price?.toString() ?? "");
  const [adminNote, setAdminNote] = useState(b.admin_note ?? "");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!b.photo_paths.length) return;
    supabase().storage.from(PHOTO_BUCKET).createSignedUrls(b.photo_paths, 600)
      .then(({ data }) => setPhotoUrls((data ?? []).map((d) => d.signedUrl).filter(Boolean) as string[]));
  }, [b.photo_paths]);

  async function save() {
    setMsg(null);
    const { error } = await supabase().from("bookings").update({
      status,
      payment_status: paymentStatus,
      confirmed_at: confirmedAt ? new Date(confirmedAt).toISOString() : null,
      travel_fee: travelFee === "" ? null : Number(travelFee),
      final_price: finalPrice === "" ? null : Number(finalPrice),
      admin_note: adminNote || null,
    }).eq("id", b.id);
    if (error) return setMsg("儲存失敗：" + error.message);
    setMsg("已儲存");
    onSaved();
  }

  const place = b.service_mode === "hospital" ? `${b.hospital_name ?? ""} ${b.ward_room ?? ""}` : b.address ?? "";
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((b.service_mode === "hospital" ? b.hospital_name : b.address) ?? "")}`;

  return (
    <div className="grid gap-6 border-t border-border bg-bg px-4 py-5 md:grid-cols-2">
      <dl className="space-y-1.5 text-[0.95rem]">
        <Item k="聯絡人">{b.contact_name}{b.is_proxy && "（家屬代訂）"}</Item>
        <Item k="手機"><a href={`tel:${b.phone}`} className="text-brand underline">{b.phone}</a></Item>
        {b.line_id && <Item k="LINE">{b.line_id}</Item>}
        <Item k="地點">{place} <a href={mapUrl} target="_blank" rel="noopener" className="ml-1 text-brand underline">地圖</a></Item>
        <Item k="手術">{formatTW(b.surgery_at)}</Item>
        <Item k="希望時段">{b.preferred_slots.map((s, i) => <div key={s}>{i + 1}. {formatTW(s)}</div>)}</Item>
        <Item k="部位">{labelOf(BODY_PARTS, b.body_parts)}{b.nail_count && `，約 ${b.nail_count} 指`}</Item>
        <Item k="種類">{b.nail_types.map((t) => labelOf(NAIL_TYPES, t)).join("、")}</Item>
        <Item k="付款">{b.payment_method === "cash" ? "現金" : "匯款"}｜預估 {money(b.estimated_price)}{b.rush_fee > 0 && `（含急件 ${money(b.rush_fee)}）`}</Item>
        {b.note && <Item k="客人備註"><span className="whitespace-pre-line">{b.note}</span></Item>}
        <Item k="建立">{formatTW(b.created_at)}</Item>
        {photoUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {photoUrls.map((u) => (
              <a key={u} href={u} target="_blank" rel="noopener">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="指甲照片" className="h-24 w-24 rounded-lg object-cover" />
              </a>
            ))}
          </div>
        )}
      </dl>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">狀態
            <select className="field mt-1" value={status} onChange={(e) => setStatus(e.target.value)}>
              {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="text-sm">付款狀態
            <select className="field mt-1" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              {Object.entries(PAYMENT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>
        <label className="block text-sm">確認服務時間
          <input className="field mt-1" type="datetime-local" value={confirmedAt} onChange={(e) => setConfirmedAt(e.target.value)} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">車馬費
            <input className="field mt-1" type="number" inputMode="numeric" value={travelFee} onChange={(e) => setTravelFee(e.target.value)} />
          </label>
          <label className="text-sm">最終金額
            <input className="field mt-1" type="number" inputMode="numeric" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} />
          </label>
        </div>
        <label className="block text-sm">內部備註
          <textarea className="field mt-1 min-h-20" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} />
        </label>
        <div className="flex items-center gap-3">
          <button onClick={save} className="btn btn-peach py-2">儲存</button>
          {msg && <span className="text-sm text-muted">{msg}</span>}
        </div>
      </div>
    </div>
  );
}

function Item({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-muted">{k}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}
