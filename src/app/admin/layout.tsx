import type { Metadata } from "next";
import AdminShell from "./AdminShell";

export const metadata: Metadata = { title: "管理後台", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
