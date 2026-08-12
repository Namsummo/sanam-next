import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";

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

export default async function IntroducePage() {
  const bgSettings = await getBackgroundSettings().catch(() => null);

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
        <div className="mx-auto max-w-7xl space-y-10">
          {/* Kinh Quan Thầy */}
          <section className="mx-auto max-w-5xl space-y-4 text-left">
            <h1 className="text-center text-3xl font-bold">
              Kinh ông thánh Quan Thầy Venceslao
            </h1>

            <p className="text-lg leading-8 text-foreground/90">
              Lạy ơn ông Thánh Venceslao vua, xưa đã đánh giặc xác thịt thế
              gian, ma quỷ là ba thù mạnh, cho hết lòng hết sức, vì có lòng kính
              mến trông cậy Đức Chúa Trời cho vững, chúng con xin ông Thánh
              Venceslao cầu cho chúng con đáng chịu lấy những sự Chúa Kitô đã
              hứa, Lạy ơn Đức Chúa Trời có phép vô cùng đã ban nhân đức khiêm
              nhường nhịn nhục cho ông Thánh Venceslao hạ mình xuống, vì đã được
              lên cao trọng làm vua thế gian mà càng lên trọng thì nên hưởng
              phúc Thiên đàng, chúng con xin Người cầu cho chúng con được lòng
              kính mến bắt chước Người, vì Đức khiêm nhường, nhịn nhục ở đời
              này cho ngày sau được hưởng phúc trọng cùng Người trên nước Thiên
              đàng, vì Đức Chúa Giêsu Kitô là Chúa chúng con. Amen
            </p>
          </section>

          {/* Các mục giới thiệu */}
          <div className="flex flex-wrap justify-center gap-6">
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