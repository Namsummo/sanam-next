import { notFound } from "next/navigation";
import { AdminOrganizationForm } from "@/components/admin/organizations/admin-organization-form";
import { getAdminOrganization } from "@/lib/organization/api";

export const metadata = {
  title: "Chỉnh sửa Đoàn thể | Sanam Admin",
};

export default async function EditOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const organization = await getAdminOrganization(id);
    return <AdminOrganizationForm organization={organization} />;
  } catch {
    notFound();
  }
}
