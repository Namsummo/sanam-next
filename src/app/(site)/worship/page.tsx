import type { Metadata } from "next";
import { LiturgyPage } from "@/components/site/liturgy/liturgy-page";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import {
  getPublishedGospels,
  getPublishedReflections,
  getSeasonsWithFeasts,
} from "@/shared/services/liturgy-api";

export const metadata: Metadata = {
  title: "Phụng Vụ — Giáo xứ Sa Nam",
  description:
    "Mùa phụng vụ, Lời Chúa hàng ngày và suy niệm của Giáo xứ Sa Nam.",
};

export default async function WorshipPage() {
  const [seasons, gospels, reflections, bgSettings] = await Promise.all([
    getSeasonsWithFeasts(),
    getPublishedGospels(),
    getPublishedReflections(),
    getBackgroundSettings().catch(() => null),
  ]);

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
      <main className="min-h-screen w-full bg-background px-4 py-10 md:px-8 md:py-16 lg:px-12">
        <LiturgyPage
          seasons={seasons}
          gospels={gospels}
          reflections={reflections}
        />
      </main>
    </>
  );
}
