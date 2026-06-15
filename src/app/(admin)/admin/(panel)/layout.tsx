import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export default function AdminPanelLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
