// Supabase Edge Function: push a LINE message to the admin when a booking is inserted.
// Triggered by a Database Webhook (bookings, INSERT) — see README「LINE 通知設定」.
//
// Secrets (supabase secrets set ...):
//   LINE_CHANNEL_ACCESS_TOKEN  Messaging API long-lived channel access token
//   LINE_ADMIN_USER_ID         Admin's LINE user ID (LINE Developers → Basic settings → Your user ID)
//   WEBHOOK_SECRET             Shared secret sent by the webhook as the x-webhook-secret header

const MODE: Record<string, string> = { home: "到府", hospital: "到院" };
const PARTS: Record<string, string> = { hands: "手", feet: "腳", both: "手＋腳" };
const CITY: Record<string, string> = { taipei: "台北市", new_taipei: "新北市", taoyuan: "桃園市" };
const TYPES: Record<string, string> = {
  polish: "一般甲油", gel: "光療", acrylic: "水晶/延甲", tips: "甲片", deco: "鑽飾", unsure: "不確定",
};
const URGENCY: Record<string, string> = { rush: "🔴 急件", priority: "🟡 優先", normal: "一般" };

const tw = (iso: string) =>
  new Date(iso).toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei", month: "numeric", day: "numeric", weekday: "short",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("unauthorized", { status: 401 });
  }

  const payload = await req.json();
  const b = payload?.record;
  if (payload?.type !== "INSERT" || !b) return new Response("ignored");

  const place = b.service_mode === "hospital"
    ? `${b.hospital_name ?? ""} ${b.ward_room ?? ""}`.trim()
    : b.address ?? "";

  const text = [
    `【指安 新預約】${URGENCY[b.urgency] ?? b.urgency}`,
    `編號：${b.booking_no}`,
    `手術：${tw(b.surgery_at)}`,
    `希望時段：\n${(b.preferred_slots as string[]).map((s) => "・" + tw(s)).join("\n")}`,
    `方式：${MODE[b.service_mode]}｜${CITY[b.city]}`,
    `地點：${place}`,
    `部位：${PARTS[b.body_parts]}｜${(b.nail_types as string[]).map((t) => TYPES[t] ?? t).join("、") || "—"}${b.nail_count ? `｜約 ${b.nail_count} 指` : ""}`,
    `聯絡：${b.contact_name}${b.is_proxy ? "（家屬代訂）" : ""} ${b.phone}${b.line_id ? `｜LINE ${b.line_id}` : ""}`,
    `付款：${b.payment_method === "transfer" ? "匯款" : "現金"}｜預估 NT$${b.estimated_price}`,
    b.photo_paths?.length ? `照片：${b.photo_paths.length} 張（請至後台查看）` : "",
    b.note ? `備註：${b.note}` : "",
  ].filter(Boolean).join("\n");

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN")}`,
    },
    body: JSON.stringify({
      to: Deno.env.get("LINE_ADMIN_USER_ID"),
      messages: [{ type: "text", text: text.slice(0, 5000) }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("LINE push failed", res.status, err);
    return new Response(err, { status: 502 });
  }
  return new Response("ok");
});
