import type { Metadata } from "next";
import { CouncilPageSection } from "@/components/site/clergy/council-page-section";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";

export const metadata: Metadata = {
  title: "Ban Hành Giáo",
  description:
    "Danh sách Ban Hành Giáo Giáo xứ Sa Nam qua các nhiệm kỳ — tìm kiếm và xem theo khóa.",
};

export default async function BanHanhGiaoPage() {
  const bgSettings = await getBackgroundSettings().catch(() => null);

  return (
    <>
      <PageHeader
        title="Ban Hành Giáo"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu", href: "/introduce" },
          { label: "Ban Hành Giáo" },
        ]}
        backgroundImage={bgSettings?.introduceBg}
      />

      <article className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1300px]">
          <CouncilPageSection />
        </div>
      </article>
    </>
  );
}
