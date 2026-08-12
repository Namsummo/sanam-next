import { PageHeader } from "@/components/site/shared/components/page/page-header";

export default function SoGiaoDanPage() {
  return (
    <>
      <PageHeader
        title="Sổ giáo dân"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu", href: "/introduce" },
          { label: "Sổ giáo dân" },
        ]}
      />

    </>
  )
}
