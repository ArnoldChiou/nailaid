import type { Metadata } from "next";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = { title: "查詢我的預約", ...noIndex };

export default function BookingLayout({ children }: LayoutProps<"/booking">) {
  return children;
}
