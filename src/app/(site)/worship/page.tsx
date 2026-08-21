import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";

export const metadata = {
  title: "Phụng Vụ — Giáo xứ Sa Nam",
  description: "Thông tin phụng vụ tại Giáo xứ Sa Nam.",
};

export default async function WorshipPage() {
  const bgSettings = await getBackgroundSettings().catch(() => null);

  return (
    <>
      <PageHeader
        title="Phụng Vụ"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Phụng vụ" },
        ]}
        backgroundImage={bgSettings?.worshipBg}
      />
      <main className="min-h-screen w-full bg-background px-4 py-8 md:px-8 lg:px-12">
        <div className="mx-auto max-w-225 py-16 text-center">
          <p className="font-display text-xl font-semibold text-primary md:text-2xl">
            Nội dung đang được cập nhật
          </p>
          <p className="mt-3 font-sans text-sm text-foreground/70 md:text-base">
            Vui lòng quay lại sau.
          </p>
        </div>
      </main>
    </>
  );
}
