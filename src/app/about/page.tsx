import type { Metadata } from "next";
import { CTA, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "關於指安" };

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
          「指安」取「指甲平安」的意思。我們專門處理術前卸甲，到府、到院病房都可以，
          希望讓病人和家屬把心力留給真正重要的事。
        </p>
        <CTA />
      </Container>
    </>
  );
}
