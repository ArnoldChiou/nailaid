import { SITE } from "./site";

export type Urgency = "rush" | "priority" | "normal";

const HOUR = 3600_000;

/**
 * Mirrors public.compute_urgency() in supabase/migrations — the database is the
 * source of truth; this copy only drives the live estimate on the booking form.
 * Rush: the earliest requested slot is within 24h of the surgery or of now.
 */
export function computeUrgency(surgeryAt: Date, earliestSlot: Date, now = new Date()): Urgency {
  const toSurgery = surgeryAt.getTime() - earliestSlot.getTime();
  const toSlot = earliestSlot.getTime() - now.getTime();
  if (toSurgery <= 24 * HOUR || toSlot <= 24 * HOUR) return "rush";
  if (surgeryAt.getTime() - now.getTime() <= 72 * HOUR) return "priority";
  return "normal";
}

export function estimate(urgency: Urgency) {
  const rushFee = urgency === "rush" ? SITE.rushFee : 0;
  return { base: SITE.basePrice, rushFee, total: SITE.basePrice + rushFee };
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  rush: "急件",
  priority: "優先",
  normal: "一般",
};

export function formatTW(iso: string | Date | null | undefined) {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const money = (n: number | null | undefined) =>
  n == null ? "—" : `NT$${n.toLocaleString("en-US")}`;
