import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { FAQ } from "@/lib/faq";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import { CTA, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = pageMeta({
  title: "常見問題",
  description: "手術前卸甲常見問題：開刀前一定要卸光療嗎？指甲油會影響血氧機嗎？腳趾甲也要卸嗎？住院可以到病房卸嗎？多少錢？",
  path: "/faq/",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={[faqSchema(FAQ), breadcrumbSchema([{ name: "常見問題", path: "/faq/" }])]} />
      <PageHeader art="step-chat" eyebrow="常見問題" title="手術前卸甲，您可能想知道" />
      <Container className="space-y-3 py-10">
        {FAQ.map(({ q, a }, i) => (
          // First few stay open so the direct answers are visible without a click.
          <details key={q} open={i < 3} className="group paper px-5 py-4 open:shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-round text-lg">
              <h2 className="text-lg">{q}</h2>
              <span className="text-brand transition group-open:rotate-45" aria-hidden>＋</span>
            </summary>
            <p className="mt-3 leading-relaxed text-muted">{a}</p>
          </details>
        ))}
        <div className="pt-8"><CTA /></div>
      </Container>
    </>
  );
}
