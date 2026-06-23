import type { Metadata } from "next";
import { AdminOrganizationEditPage } from "@/components/admin/organizations/admin-organization-edit-page";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Chỉnh sửa Đoàn thể | Sanam Admin",
};

export default function EditOrganizationPage({ params }: Props) {
  return <AdminOrganizationEditPage params={params} />;
}
