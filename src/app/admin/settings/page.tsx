"use client";

import { useCallback, useEffect, useState } from "react";
import { formatTW } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";

type Notice = {
  id: string;
  message: string;
  starts_at: string | null;
  ends_at: string | null;
  pause_booking: boolean;
  active: boolean;
};

export default function AdminSettingsPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Notices />
      <BankSettings />
    </div>
  );
}

async function fetchNoticeList() {
  const { data } = await supabase().from("notices").select("*").order("created_at", { ascending: false });
  return (data as Notice[]) ?? [];
}

function Notices() {
  const [list, setList] = useState<Notice[]>([]);
  const [message, setMessage] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [pause, setPause] = useState(false);

  const load = useCallback(async () => setList(await fetchNoticeList()), []);
  useEffect(() => {
    fetchNoticeList().then(setList);
  }, []);

  async function add() {
    if (!message.trim()) return;
    await supabase().from("notices").insert({
      message: message.trim(),
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      pause_booking: pause,
    });
    setMessage(""); setEndsAt(""); setPause(false);
    load();
  }

  async function toggle(n: Notice) {
    await supabase().from("notices").update({ active: !n.active }).eq("id", n.id);
    load();
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="text-lg font-bold">網站公告</h2>
      <p className="mt-1 text-sm text-muted">顯示在網站最上方。勾選「暫停線上預約」時，預約表單會關閉。</p>
      <div className="mt-4 space-y-3">
        <textarea className="field min-h-20" placeholder="例：10/10～10/12 國慶連假暫停服務" value={message} onChange={(e) => setMessage(e.target.value)} />
        <label className="block text-sm">結束時間（選填，時間到自動下架）
          <input className="field mt-1" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-5 w-5" checked={pause} onChange={(e) => setPause(e.target.checked)} />
          暫停線上預約
        </label>
        <button onClick={add} className="btn btn-peach py-2">發布公告</button>
      </div>
      <ul className="mt-6 divide-y divide-border">
        {list.map((n) => (
          <li key={n.id} className="flex items-start justify-between gap-3 py-3">
            <div className={n.active ? "" : "opacity-50"}>
              <p>{n.message}</p>
              <p className="text-xs text-muted">
                {n.pause_booking && <span className="mr-2 font-semibold text-rush">暫停預約</span>}
                {n.ends_at ? `至 ${formatTW(n.ends_at)}` : "無結束時間"}
              </p>
            </div>
            <button onClick={() => toggle(n)} className="shrink-0 text-sm text-brand underline">{n.active ? "下架" : "重新上架"}</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BankSettings() {
  const [bank, setBank] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase().from("settings").select("bank_info").eq("id", 1).single()
      .then(({ data }) => setBank(data?.bank_info ?? ""));
  }, []);

  async function save() {
    const { error } = await supabase().from("settings").update({ bank_info: bank, updated_at: new Date().toISOString() }).eq("id", 1);
    setMsg(error ? "儲存失敗：" + error.message : "已儲存");
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="text-lg font-bold">匯款資訊</h2>
      <p className="mt-1 text-sm text-muted">只會在客人預約成功後、以及查詢預約時顯示，不會公開在網站上。</p>
      <textarea
        className="field mt-4 min-h-28 font-mono"
        placeholder={"銀行：○○銀行（代碼 000）\n帳號：0000-0000-0000\n戶名：○○○"}
        value={bank} onChange={(e) => setBank(e.target.value)}
      />
      <div className="mt-3 flex items-center gap-3">
        <button onClick={save} className="btn btn-peach py-2">儲存</button>
        {msg && <span className="text-sm text-muted">{msg}</span>}
      </div>
    </section>
  );
}
