import type { Metadata } from "next";
import { AdminNewsEditPage } from "@/components/admin/news/admin-edit-page";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Chỉnh sửa bài viết",
};

export default function AdminNewsEdit({ params }: Props) {
  return <AdminNewsEditPage params={params} />;
}
