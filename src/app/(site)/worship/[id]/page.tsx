import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiturgyDayPanel } from "@/components/site/liturgy/liturgy-day-panel";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { formatIsoDateToVi } from "@/lib/format";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { getGospelById } from "@/shared/services/liturgy-api";

type WorshipDayPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: WorshipDayPageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const gospel = await getGospelById(decodeURIComponent(rawId));

  if (!gospel) {
    return { title: "Không tìm thấy" };
  }

  return {
    title: `${gospel.liturgicalDayName} — Phụng Vụ`,
    description: `Lời Chúa ngày ${formatIsoDateToVi(gospel.date)}.`,
  };
}

export default async function WorshipDayPage({ params }: WorshipDayPageProps) {
  const { id: rawId } = await params;
  const gospel = await getGospelById(decodeURIComponent(rawId));

  if (!gospel) {
    notFound();
  }

  const bgSettings = await getBackgroundSettings().catch(() => null);

  return (
    <>
      <PageHeader
        title={`Lời Chúa Ngày ${formatIsoDateToVi(gospel.date)}`}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Phụng vụ", href: "/worship" },
        ]}
        backgroundImage={bgSettings?.worshipBg}
      />
      <main className="min-h-screen w-full bg-background px-4 py-10 md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto max-w-6xl rounded-[20px] border border-border bg-card/60 p-5 md:p-8">
          <LiturgyDayPanel gospel={gospel} />
        </div>
      </main>
    </>
  );
}
