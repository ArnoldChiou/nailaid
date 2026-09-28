"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { isConfigured, supabase } from "@/lib/supabase";
import Logo from "@/components/Logo";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [adminCheck, setAdminCheck] = useState<{ uid: string; ok: boolean } | null>(null);
  const uid = session?.user.id;
  const isAdmin = uid && adminCheck?.uid === uid ? adminCheck.ok : null;

  useEffect(() => {
    if (!isConfigured) return;
    const sb = supabase();
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return;
    supabase().rpc("is_admin").then(({ data }) => setAdminCheck({ uid, ok: Boolean(data) }));
  }, [uid]);

  let body: ReactNode;
  if (!isConfigured) body = <Center>尚未設定 Supabase，後台無法使用。請參考 README 完成設定。</Center>;
  else if (session === undefined) body = null;
  else if (!session) body = <Login />;
  else if (isAdmin === null) body = null;
  else if (!isAdmin) body = <Center>此帳號沒有管理權限。<SignOut /></Center>;
  else body = children;

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-5 px-4">
          <Link href="/admin/"><Logo /></Link>
          {session && isAdmin && (
            <nav className="flex flex-1 items-center gap-4 text-[0.95rem]">
              <Link href="/admin/" className={pathname === "/admin/" || pathname === "/admin" ? "font-bold text-brand" : "text-muted"}>訂單</Link>
              <Link href="/admin/settings/" className={pathname.startsWith("/admin/settings") ? "font-bold text-brand" : "text-muted"}>公告與設定</Link>
              <span className="flex-1" />
              <SignOut />
            </nav>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{body}</div>
    </div>
  );
}

function Center({ children }: { children: ReactNode }) {
  return <div className="mx-auto mt-16 max-w-md space-y-4 rounded-2xl border border-border bg-surface p-6 text-center">{children}</div>;
}

function SignOut() {
  return (
    <button onClick={() => supabase().auth.signOut()} className="text-sm text-muted underline">
      登出
    </button>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr("登入失敗：帳號或密碼錯誤");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-16 max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-6">
      <h1 className="text-xl font-bold">管理者登入</h1>
      <input className="field" type="email" autoComplete="username" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="field" type="password" autoComplete="current-password" placeholder="密碼" required value={password} onChange={(e) => setPassword(e.target.value)} />
      {err && <p className="text-sm text-rush">{err}</p>}
      <button disabled={busy} className="w-full rounded-full bg-brand py-3 font-bold text-white disabled:opacity-60">登入</button>
    </form>
  );
}
