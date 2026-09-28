import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = { title: "預約已送出", ...noIndex };

export default function DoneLayout({ children }: LayoutProps<"/book/done">) {
  return children;
}
