import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "聯絡我們" };

export default function ContactPage() {
  const any = SITE.lineUrl || SITE.phone;
  return (
    <>
      <PageHeader art="step-chat" eyebrow="聯絡我們" title="有問題？直接問我們" lead="急件請直接線上預約，系統會即時通知我們。" />
      <Container className="grid gap-4 py-10 sm:grid-cols-2">
        {SITE.lineUrl && (
          <a href={SITE.lineUrl} className="paper border-line bg-line p-6 text-white">
            <p className="text-xl">LINE 官方帳號</p>
            <p className="mt-1 text-white/85">ID：{SITE.lineId}｜點此加入好友並傳訊息</p>
          </a>
        )}
        {SITE.phone && (
          <a href={`tel:${SITE.phone}`} className="paper p-6">
            <p className="text-xl">電話</p>
            <p className="mt-1 text-muted">{SITE.phone}</p>
          </a>
        )}
        <Link href="/book/" className="paper border-ink bg-peach p-6">
          <p className="text-xl">線上預約</p>
          <p className="mt-1 text-ink/75">填寫表單，我們會盡快與您聯絡確認</p>
        </Link>
        {!any && (
          <div className="rounded-2xl border border-dashed border-border p-6 text-muted">
            LINE 官方帳號與電話即將開通。
          </div>
        )}
      </Container>
    </>
  );
}
