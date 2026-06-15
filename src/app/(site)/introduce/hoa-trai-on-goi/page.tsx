import type { Metadata } from "next";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { VocationFruitPageSection } from "@/components/site/vocation/vocation-fruit-page-section";

export const metadata: Metadata = {
  title: "Hoa trái ơn gọi",
  description:
    "Danh sách các Cha, Thầy, Dì quê hương Giáo xứ Sa Nam — những hoa trái ơn gọi trong Giáo hội.",
};

export default function HoaTraiOnGoiPage() {
  return (
    <>
      <PageHeader
        title="Hoa trái ơn gọi"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu", href: "/introduce" },
          { label: "Hoa trái ơn gọi" },
        ]}
      />

      <article className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1300px]">
          <VocationFruitPageSection />
        </div>
      </article>
    </>
  );
}
