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
  // Arrived from a "set password" email link: show the new-password form first.
  const [recovery, setRecovery] = useState(
    () => typeof window !== "undefined" && window.location.hash.includes("type=recovery"),
  );

  useEffect(() => {
    if (!isConfigured) return;
    const sb = supabase();
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
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
  else if (recovery) body = <SetPassword onDone={() => setRecovery(false)} />;
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

function SetPassword({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return setErr("密碼至少 8 個字元");
    if (pw !== pw2) return setErr("兩次輸入的密碼不一致");
    setBusy(true);
    const { error } = await supabase().auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr("設定失敗：" + error.message);
    history.replaceState(null, "", window.location.pathname);
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-16 max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-6">
      <h1 className="text-xl font-bold">設定新密碼</h1>
      <input className="field" type="password" autoComplete="new-password" placeholder="新密碼（至少 8 個字元）" required value={pw} onChange={(e) => setPw(e.target.value)} />
      <input className="field" type="password" autoComplete="new-password" placeholder="再輸入一次" required value={pw2} onChange={(e) => setPw2(e.target.value)} />
      {err && <p className="text-sm text-rush">{err}</p>}
      <button disabled={busy} className="btn btn-peach w-full">儲存密碼</button>
    </form>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr("登入失敗：帳號或密碼錯誤");
  }

  async function forgot() {
    if (!email) return setErr("請先輸入 Email");
    setBusy(true);
    await supabase().auth.resetPasswordForEmail(email, { redirectTo: window.location.href.split("#")[0] });
    setBusy(false);
    setErr(null);
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-16 max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-6">
      <h1 className="text-xl font-bold">管理者登入</h1>
      <input className="field" type="email" autoComplete="username" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="field" type="password" autoComplete="current-password" placeholder="密碼" required value={password} onChange={(e) => setPassword(e.target.value)} />
      {err && <p className="text-sm text-rush">{err}</p>}
      <button disabled={busy} className="btn btn-peach w-full">登入</button>
      {sent ? (
        <p className="text-sm text-muted">已寄出設定密碼的信，請到信箱點連結。</p>
      ) : (
        <button type="button" onClick={forgot} disabled={busy} className="text-sm text-muted underline">忘記密碼？</button>
      )}
    </form>
  );
}
