import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { CTA, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = pageMeta({
  title: "關於甲援",
  description: "甲援 NailAid 專門處理手術前的指甲卸除，到府、到院病房都可以，讓病人和家屬少一件擔心的事。",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="關於我們" title="讓手術前少一件擔心的事" />
      <Container className="prose-zh space-y-5 py-10 text-lg">
        <p>
          很多人是在手術前一兩天，才從護理師口中得知「指甲要卸乾淨」。
          光療和水晶指甲沒辦法用去光水處理，一般美甲店又常常排不到、或不接只卸不做的單。
        </p>
        <p>
          「甲援」就是指甲的救援。我們專門處理術前卸甲，到府、到院病房都可以，
          希望讓病人和家屬把心力留給真正重要的事。
        </p>
        <CTA />
      </Container>
    </>
  );
}
