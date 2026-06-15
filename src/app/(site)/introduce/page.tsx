import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/shared/components/page/page-header";

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
] as const;

export default function IntroducePage() {
  return (
    <>
      <PageHeader
        title="Giới thiệu"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu" },
        ]}
      />

      <article className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1300px]">
          <p className="mx-auto mb-12 max-w-[800px] text-center font-sans text-lg leading-relaxed text-foreground md:mb-16">
            Nội dung giới thiệu Giáo xứ đang được cập nhật.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {introduceLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[20px] border border-border/40 bg-[#eae7de]/50 p-6 transition-colors hover:border-accent/40 hover:bg-[#eae7de]/80"
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
