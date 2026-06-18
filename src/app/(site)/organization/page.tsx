import type { Metadata } from "next";
import { OrganizationCard } from "@/components/site/organization/organization-card";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { getOrganizations } from "@/lib/organization/api";

export const metadata: Metadata = {
  title: "Đoàn thể",
  description: "Các đoàn thể, hội đoàn đang hoạt động tại Giáo xứ Sa Nam",
};

export default async function OrganizationPage() {
  const [organizations, bgSettings] = await Promise.all([
    getOrganizations(),
    getBackgroundSettings().catch(() => null),
  ]);

  return (
    <>
      <PageHeader
        title="Đoàn thể và Hội đoàn"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Đoàn thể" },
        ]}
        backgroundImage={bgSettings?.organizationBg}
      />
      <section className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1300px]">
          {organizations.length === 0 ? (
            <p className="text-center font-sans text-lg text-foreground">
              Chưa có hội đoàn nào được cập nhật.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {organizations.map((organization) => (
                <OrganizationCard key={organization._id} organization={organization} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
