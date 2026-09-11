import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { getIntroduceSettings } from "@/shared/services/introduce-settings-api";
import { NewsHtmlContent } from "@/components/site/news/news-html-content";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Giới thiệu Giáo xứ Sa Nam.",
};

const introduceLinks = [
  {
    href: "/introduce/ban-hanh-giao",
    title: "Ban Hành Giáo",
    description:
      "Danh sách Ban Hành Giáo qua các nhiệm kỳ — tìm kiếm và chọn khóa.",
  },
  {
    href: "/introduce/hoa-trai-on-goi",
    title: "Hoa trái ơn gọi",
    description:
      "Danh sách các Cha, Thầy, Dì quê hương xuất thân từ giáo xứ Sa Nam.",
  },
  {
    href: "/introduce/so-gia-dinh-cong-giao",
    title: "Sổ Gia Đình Công Giáo",
    description:
      "Danh sách các gia đình Công giáo đang sinh hoạt tại Giáo xứ Sa Nam.",
  },
] as const;

export default async function IntroducePage() {
  const [bgSettings, introduceSettings] = await Promise.all([
    getBackgroundSettings().catch(() => null),
    getIntroduceSettings().catch(() => null),
  ]);

  const title = introduceSettings?.title || "Kinh ông thánh Quan Thầy Venceslao";
  const content = introduceSettings?.content || "";

  return (
    <>
      <PageHeader
        title="Giới thiệu"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu" },
        ]}
        backgroundImage={bgSettings?.introduceBg}
      />

      <article className="px-6 py-16 md:py-30">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Nội dung giới thiệu */}
          <section className="mx-auto max-w-5xl space-y-6">
            {title ? (
              <h1 className="text-center font-display text-3xl md:text-4xl font-bold text-primary">
                {title}
              </h1>
            ) : null}

            {content ? (
              <NewsHtmlContent html={content} className="border-none pb-0 text-foreground/90 leading-8" />
            ) : null}
          </section>

          {/* Các mục giới thiệu */}
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            {introduceLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group w-full max-w-sm rounded-[20px] border border-border/40 bg-[#eae7de]/50 p-6 transition-colors hover:border-accent/40 hover:bg-[#eae7de]/80"
              >
                <h2 className="font-display text-xl font-semibold text-primary group-hover:text-accent">
                  {item.title}
                </h2>

                <p className="mt-2 font-sans text-sm leading-relaxed text-foreground/80">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}