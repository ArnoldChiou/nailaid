"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  BODY_PARTS, CITIES, NAIL_TYPES, SERVICE_MODES, SITE, labelOf,
  type BodyPart, type CityId, type ServiceMode,
} from "@/lib/site";
import { URGENCY_LABEL, computeUrgency, estimate, formatTW, money } from "@/lib/pricing";
import { PHOTO_BUCKET, isConfigured, supabase } from "@/lib/supabase";
import { fetchNotices } from "@/components/NoticeBar";

export const LAST_BOOKING_KEY = "nailsafe:lastBooking";

export type BookingResult = {
  booking_no: string;
  urgency: "rush" | "priority" | "normal";
  estimated_price: number;
  rush_fee: number;
  city: CityId;
  payment_method: "cash" | "transfer";
  bank_info: string;
  demo?: boolean;
};

type Form = {
  body_parts: BodyPart | "";
  nail_types: string[];
  nail_count: string;
  service_mode: ServiceMode | "";
  city: CityId | "";
  address: string;
  hospital_name: string;
  ward_room: string;
  surgery_at: string;
  slots: string[];
  contact_name: string;
  phone: string;
  line_id: string;
  is_proxy: boolean;
  payment_method: "cash" | "transfer" | "";
  note: string;
  agree: boolean;
};

const EMPTY: Form = {
  body_parts: "", nail_types: [], nail_count: "", service_mode: "", city: "",
  address: "", hospital_name: "", ward_room: "", surgery_at: "", slots: ["", "", ""],
  contact_name: "", phone: "", line_id: "", is_proxy: false, payment_method: "", note: "", agree: false,
};

const STEPS = ["服務內容", "時間地點", "聯絡資料", "確認送出"];
const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const setMinNow = (e: { currentTarget: HTMLInputElement }) => {
  e.currentTarget.min = localInputValue(new Date());
};

/** value for <input type="datetime-local"> in the visitor's local time */
function localInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function validate(step: number, f: Form, photos: File[]): string | null {
  if (step === 0) {
    if (!f.body_parts) return "請選擇卸除部位";
    if (!f.nail_types.length) return "請選擇指甲種類（不確定可選「不確定」）";
    if (photos.some((p) => p.size > MAX_PHOTO_BYTES)) return "每張照片請小於 5MB";
  }
  if (step === 1) {
    if (!f.service_mode) return "請選擇服務方式";
    if (!f.city) return "請選擇縣市";
    if (f.service_mode === "home" && !f.address.trim()) return "請填寫服務地址";
    if (f.service_mode === "hospital" && !f.hospital_name.trim()) return "請填寫醫院名稱";
    if (!f.surgery_at) return "請填寫手術日期與時間";
    if (!f.slots[0]) return "請至少填寫一個希望服務時段";
    const surgery = new Date(f.surgery_at);
    for (const s of f.slots.filter(Boolean)) {
      if (new Date(s) < new Date(Date.now() - 5 * 60_000)) return "希望服務時段不能早於現在";
      if (new Date(s) > surgery) return "希望服務時段需在手術之前";
    }
  }
  if (step === 2) {
    if (!f.contact_name.trim()) return "請填寫聯絡人姓名";
    if (!/^[0-9+\- ]{8,20}$/.test(f.phone.trim())) return "請填寫正確的手機號碼";
    if (!f.payment_method) return "請選擇付款方式";
  }
  if (step === 3 && !f.agree) return "請閱讀並同意服務條款與隱私權政策";
  return null;
}

export default function BookingForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(EMPTY);
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paused, setPaused] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices()
      .then((ns) => setPaused(ns.find((n) => n.pause_booking)?.message ?? null))
      .catch(() => {});
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((prev) => ({ ...prev, [k]: v }));

  const est = useMemo(() => {
    const slots = f.slots.filter(Boolean).map((s) => new Date(s)).sort((a, b) => +a - +b);
    if (!f.surgery_at || !slots.length) return null;
    const urgency = computeUrgency(new Date(f.surgery_at), slots[0]);
    return { urgency, ...estimate(urgency) };
  }, [f.surgery_at, f.slots]);

  function next() {
    const err = validate(step, f, photos);
    setError(err);
    if (!err) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function submit() {
    const err = validate(3, f, photos);
    setError(err);
    if (err) return;
    setSubmitting(true);
    try {
      const payload = {
        body_parts: f.body_parts,
        nail_types: f.nail_types,
        nail_count: f.nail_count,
        service_mode: f.service_mode,
        city: f.city,
        address: f.service_mode === "home" ? f.address : "",
        hospital_name: f.service_mode === "hospital" ? f.hospital_name : "",
        ward_room: f.service_mode === "hospital" ? f.ward_room : "",
        surgery_at: new Date(f.surgery_at).toISOString(),
        preferred_slots: f.slots.filter(Boolean).map((s) => new Date(s).toISOString()),
        contact_name: f.contact_name,
        phone: f.phone,
        line_id: f.line_id,
        is_proxy: f.is_proxy,
        payment_method: f.payment_method,
        note: f.note,
        photo_paths: [] as string[],
      };

      let result: BookingResult;
      if (isConfigured) {
        const sb = supabase();
        const folder = `uploads/${crypto.randomUUID()}`;
        for (const [i, file] of photos.entries()) {
          const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
          const path = `${folder}/${i + 1}.${ext}`;
          const { error: upErr } = await sb.storage.from(PHOTO_BUCKET).upload(path, file, { contentType: file.type });
          if (upErr) throw new Error("照片上傳失敗，請改用較小的照片或先不上傳");
          payload.photo_paths.push(path);
        }
        const { data, error: rpcErr } = await sb.rpc("create_booking", { p: payload });
        if (rpcErr) throw new Error(rpcErr.message);
        result = data as BookingResult;
      } else {
        // Demo mode: Supabase not connected yet — nothing is saved or sent.
        await new Promise((r) => setTimeout(r, 400));
        const e = est!;
        result = {
          booking_no: "DEMO-" + Math.random().toString(36).slice(2, 6).toUpperCase(),
          urgency: e.urgency,
          estimated_price: e.total,
          rush_fee: e.rushFee,
          city: f.city as CityId,
          payment_method: f.payment_method as "cash" | "transfer",
          bank_info: "（示範）銀行代碼 000｜帳號 0000-0000-0000｜戶名 甲援",
          demo: true,
        };
      }
      sessionStorage.setItem(LAST_BOOKING_KEY, JSON.stringify(result));
      router.push("/book/done/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "送出失敗，請稍後再試或直接聯絡我們");
      setSubmitting(false);
    }
  }

  if (paused) {
    return (
      <div className="mt-8 rounded-2xl bg-accent-soft p-6">
        <p className="text-lg font-bold">目前暫停線上預約</p>
        <p className="mt-2">{paused}</p>
        {SITE.lineUrl && <a href={SITE.lineUrl} className="btn btn-line mt-4">LINE 聯絡我們</a>}
      </div>
    );
  }

  return (
    <div className="mt-6">
      {!isConfigured && (
        <p className="mb-4 rounded-xl border border-dashed border-accent bg-accent-soft px-4 py-3 text-sm">
          示範模式：資料庫尚未連接，送出的預約不會被儲存或通知。
        </p>
      )}

      {/* Progress */}
      <ol className="mb-6 flex gap-1.5" aria-label="預約步驟">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= step ? "bg-peach" : "bg-border"}`} />
            <p className={`mt-1.5 text-xs ${i === step ? "font-bold text-ink" : "text-muted"}`}>{i + 1}. {s}</p>
          </li>
        ))}
      </ol>

      <div className="space-y-6 paper p-5 md:p-7">
        {step === 0 && (
          <>
            <Field label="卸除部位" required>
              <Choices options={BODY_PARTS} value={f.body_parts} onChange={(v) => set("body_parts", v as BodyPart)} />
            </Field>
            <Field label="指甲種類（可複選）" required>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {NAIL_TYPES.map((t) => {
                  const on = f.nail_types.includes(t.id);
                  return (
                    <button
                      type="button" key={t.id} aria-pressed={on}
                      onClick={() => set("nail_types", on ? f.nail_types.filter((x) => x !== t.id) : [...f.nail_types, t.id])}
                      className={`rounded-xl border px-3 py-3 text-left ${on ? "border-brand bg-brand-soft font-semibold" : "border-border"}`}
                    >
                      {on ? "✓ " : ""}{t.name}
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="大約指數" hint="手腳合計，不確定可留空">
              <input className="field max-w-40" type="number" inputMode="numeric" min={1} max={20}
                value={f.nail_count} onChange={(e) => set("nail_count", e.target.value)} />
            </Field>
            <Field label="指甲照片" hint={`選填，最多 ${MAX_PHOTOS} 張，每張 5MB 內。幫助我們判斷所需時間與工具`}>
              <input
                type="file" accept="image/*" multiple
                className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand-soft file:px-4 file:py-2 file:font-semibold file:text-brand-strong"
                onChange={(e) => setPhotos(Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS))}
              />
              {photos.length > 0 && <p className="mt-2 text-sm text-muted">已選 {photos.length} 張</p>}
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="服務方式" required>
              <div className="grid gap-2 sm:grid-cols-2">
                {SERVICE_MODES.map((m) => (
                  <button
                    type="button" key={m.id} aria-pressed={f.service_mode === m.id}
                    onClick={() => set("service_mode", m.id)}
                    className={`rounded-xl border p-4 text-left ${f.service_mode === m.id ? "border-brand bg-brand-soft" : "border-border"}`}
                  >
                    <p className="font-bold">{m.name}</p>
                    <p className="text-sm text-muted">{m.desc}</p>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="縣市" required>
              <Choices options={CITIES} value={f.city} onChange={(v) => set("city", v as CityId)} />
              {f.city && f.city !== "taipei" && <p className="mt-2 text-sm text-muted">新北、桃園依距離酌收車馬費，確認時會告知。</p>}
            </Field>
            {f.service_mode === "home" && (
              <Field label="服務地址" required>
                <input className="field" autoComplete="street-address" value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="區、路、號、樓" />
              </Field>
            )}
            {f.service_mode === "hospital" && (
              <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr]">
                <Field label="醫院名稱" required>
                  <input className="field" value={f.hospital_name} onChange={(e) => set("hospital_name", e.target.value)} placeholder="例：臺大醫院" />
                </Field>
                <Field label="病房號" hint="未知可留空">
                  <input className="field" value={f.ward_room} onChange={(e) => set("ward_room", e.target.value)} placeholder="例：7B-12" />
                </Field>
              </div>
            )}
            <Field label="手術日期與時間" required hint="不確定幾點可先填當天早上 8:00">
              <input className="field" type="datetime-local" onFocus={setMinNow} value={f.surgery_at} onChange={(e) => set("surgery_at", e.target.value)} />
            </Field>
            <Field label="希望服務時段" required hint="可填 1～3 個，我們會盡量配合第一順位">
              <div className="space-y-2">
                {f.slots.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-16 shrink-0 text-sm text-muted">第 {i + 1} 順位</span>
                    <input
                      className="field" type="datetime-local" onFocus={setMinNow} max={f.surgery_at || undefined} value={s}
                      onChange={(e) => set("slots", f.slots.map((x, j) => (j === i ? e.target.value : x)))}
                    />
                  </div>
                ))}
              </div>
            </Field>
            {est && <Estimate est={est} city={f.city} />}
          </>
        )}

        {step === 2 && (
          <>
            <Field label="聯絡人姓名" required>
              <input className="field" autoComplete="name" value={f.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
            </Field>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-5 w-5 accent-[var(--brand)]" checked={f.is_proxy} onChange={(e) => set("is_proxy", e.target.checked)} />
              我是代家人預約
            </label>
            <Field label="手機" required>
              <input className="field" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="09xx-xxx-xxx" />
            </Field>
            <Field label="LINE ID" hint="選填，方便傳訊息確認">
              <input className="field" value={f.line_id} onChange={(e) => set("line_id", e.target.value)} />
            </Field>
            <Field label="付款方式" required>
              <Choices
                options={[{ id: "cash", name: "現金" }, { id: "transfer", name: "銀行匯款" }]}
                value={f.payment_method} onChange={(v) => set("payment_method", v as "cash" | "transfer")}
              />
            </Field>
            <Field label="備註" hint="例：行動不便、正在打點滴、探病時間限制、停車資訊">
              <textarea className="field min-h-24" maxLength={1000} value={f.note} onChange={(e) => set("note", e.target.value)} />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <dl className="divide-y divide-border">
              <Row k="部位">{labelOf(BODY_PARTS, f.body_parts)}</Row>
              <Row k="指甲種類">{f.nail_types.map((t) => labelOf(NAIL_TYPES, t)).join("、")}{f.nail_count && `，約 ${f.nail_count} 指`}</Row>
              {photos.length > 0 && <Row k="照片">{photos.length} 張</Row>}
              <Row k="服務方式">{labelOf(SERVICE_MODES, f.service_mode)}｜{labelOf(CITIES, f.city)}</Row>
              <Row k="地點">{f.service_mode === "home" ? f.address : `${f.hospital_name} ${f.ward_room}`}</Row>
              <Row k="手術時間">{formatTW(new Date(f.surgery_at))}</Row>
              <Row k="希望時段">{f.slots.filter(Boolean).map((s) => formatTW(new Date(s))).join("、")}</Row>
              <Row k="聯絡人">{f.contact_name}{f.is_proxy && "（代訂）"}｜{f.phone}{f.line_id && `｜LINE ${f.line_id}`}</Row>
              <Row k="付款">{f.payment_method === "cash" ? "現金" : "銀行匯款"}</Row>
              {f.note && <Row k="備註">{f.note}</Row>}
            </dl>
            {est && <Estimate est={est} city={f.city} />}
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[var(--brand)]" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} />
              <span>
                我已閱讀並同意
                <Link href="/terms/" target="_blank" className="mx-1 text-brand underline">服務條款</Link>與
                <Link href="/privacy/" target="_blank" className="mx-1 text-brand underline">隱私權政策</Link>
                ，同意甲援為安排服務蒐集上述資料。
              </span>
            </label>
          </>
        )}

        {error && <p role="alert" className="rounded-xl bg-rush-soft px-4 py-3 font-semibold text-rush">{error}</p>}

        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button type="button" onClick={() => { setError(null); setStep(step - 1); }}
              className="btn" disabled={submitting}>
              上一步
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={next} className="btn btn-peach flex-1 text-lg">
              下一步
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting}
              className="btn btn-peach flex-1 text-lg">
              {submitting ? "送出中…" : "確認送出預約"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <p className="font-round mb-2 text-lg">
        {label}{required && <span className="ml-1 text-rush">*</span>}
        {hint && <span className="ml-2 text-sm font-normal text-muted">{hint}</span>}
      </p>
      {children}
    </div>
  );
}

function Choices({ options, value, onChange }: { options: readonly { id: string; name: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map((o) => (
        <button
          type="button" role="radio" aria-checked={value === o.id} key={o.id} onClick={() => onChange(o.id)}
          className={`min-w-20 rounded-xl border px-4 py-3 ${value === o.id ? "border-brand bg-brand-soft font-semibold" : "border-border"}`}
        >
          {o.name}
        </button>
      ))}
    </div>
  );
}

function Row({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 py-2.5">
      <dt className="w-20 shrink-0 text-muted">{k}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

function Estimate({ est, city }: { est: ReturnType<typeof estimate> & { urgency: keyof typeof URGENCY_LABEL }; city: string }) {
  const rush = est.urgency === "rush";
  return (
    <div className={`rounded-xl p-4 ${rush ? "bg-rush-soft" : "bg-brand-soft"}`}>
      <p className="text-sm text-muted">預估費用</p>
      <p className="text-2xl font-bold">{money(est.total)} 起</p>
      <p className="mt-1 text-sm">
        基本 {money(est.base)} 起
        {rush && <span className="font-semibold text-rush">＋急件 {money(est.rushFee)}</span>}
        {city && city !== "taipei" && "＋車馬費另計"}
      </p>
      {rush && <p className="mt-1 text-sm text-rush">此預約為 24 小時內急件</p>}
    </div>
  );
}
