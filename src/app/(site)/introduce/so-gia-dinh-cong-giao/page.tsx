import type { Metadata } from "next";
import { FamilyRegistryPageSection } from "@/components/site/family-registry/family-registry-page-section";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";

export const metadata: Metadata = {
  title: "Sổ Gia Đình Công Giáo",
  description:
    "Sổ Gia Đình Công Giáo Giáo xứ Sa Nam — danh sách các gia đình trong giáo xứ.",
};

export default async function SoGiaDinhCongGiaoPage() {
  const bgSettings = await getBackgroundSettings().catch(() => null);

  return (
    <>
      <PageHeader
        title="Sổ Gia Đình Công Giáo"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu", href: "/introduce" },
          { label: "Sổ Gia Đình Công Giáo" },
        ]}
        backgroundImage={bgSettings?.introduceBg}
      />

      <article className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1300px]">
          <FamilyRegistryPageSection />
        </div>
      </article>
    </>
  );
}
