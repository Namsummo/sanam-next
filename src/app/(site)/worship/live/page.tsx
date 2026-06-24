import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { WorshipPlatform } from "@/components/site/worship/worship-platform";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";

export const metadata = {
  title: "Truyền Thông Trực Tuyến — Giáo xứ Sa Nam",
  description:
    "Trang phát trực tiếp Thánh lễ và lưu trữ bài giảng, video phụng vụ của Giáo xứ Sa Nam.",
};

export default async function WorshipLivePage() {
  const bgSettings = await getBackgroundSettings().catch(() => null);

  return (
    <>
      <PageHeader
        title="Truyền Thông"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Video & Livestream" },
        ]}
        backgroundImage={bgSettings?.worshipBg}
      />
      <main className="min-h-screen w-full bg-background px-4 py-8 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[1300px]">
          <WorshipPlatform />
        </div>
      </main>
    </>
  );
}
