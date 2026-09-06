import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReflectionDetail } from "@/components/site/liturgy/reflection-detail";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { getReflectionById } from "@/shared/services/liturgy-api";

type ReflectionPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ReflectionPageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const reflection = await getReflectionById(decodeURIComponent(rawId));

  if (!reflection) {
    return { title: "Không tìm thấy" };
  }

  return {
    title: `${reflection.title} — Suy niệm`,
    description:
      reflection.keyPoint || `Suy niệm Lời Chúa: ${reflection.title}.`,
  };
}

export default async function ReflectionPage({ params }: ReflectionPageProps) {
  const { id: rawId } = await params;
  const reflection = await getReflectionById(decodeURIComponent(rawId));

  if (!reflection) {
    notFound();
  }

  const bgSettings = await getBackgroundSettings().catch(() => null);

  return (
    <>
      <PageHeader
        title={reflection.title}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Phụng vụ", href: "/worship" },
          { label: "Suy niệm" },
        ]}
        backgroundImage={bgSettings?.worshipBg}
      />
      <main className="min-h-screen w-full bg-background px-4 py-10 md:px-8 md:py-16 lg:px-12">
        <div className="mx-auto max-w-6xl rounded-[20px] border border-border bg-card/60 p-5 md:p-8">
          <ReflectionDetail reflection={reflection} />
        </div>
      </main>
    </>
  );
}
