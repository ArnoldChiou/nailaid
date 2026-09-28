"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isConfigured, supabase } from "@/lib/supabase";

export type Notice = { message: string; pause_booking: boolean };

export async function fetchNotices(): Promise<Notice[]> {
  if (!isConfigured) return [];
  const { data } = await supabase().rpc("active_notices");
  return (data as Notice[]) ?? [];
}

export default function NoticeBar() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    fetchNotices().then(setNotices).catch(() => {});
  }, []);

  if (!notices.length || pathname.startsWith("/admin")) return null;
  return (
    <div className="bg-accent-soft px-4 py-2.5 text-center text-[0.95rem] text-ink" role="status">
      {notices.map((n, i) => (
        <p key={i}>📢 {n.message}</p>
      ))}
    </div>
  );
}
