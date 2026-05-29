import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrganizationMemberDetailView } from "@/components/site/organization/organization-member-detail-view";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import {
  getOrganizationMemberDetailStaticParams,
  isPersonInOrganization,
} from "@/lib/organization/member-routes";
import { getMemberPersonById } from "@/lib/organization/mock-member-persons";
import { getOrganizationBySlug } from "@/lib/organization/mock-organizations";

type OrganizationMemberDetailPageProps = {
  params: Promise<{ slug: string; personId: string }>;
};

function getVisibleOrganization(slug: string) {
  const organization = getOrganizationBySlug(slug);
  if (!organization?.isVisible) {
    return undefined;
  }
  return organization;
}

export function generateStaticParams() {
  return getOrganizationMemberDetailStaticParams();
}

export async function generateMetadata({
  params,
}: OrganizationMemberDetailPageProps): Promise<Metadata> {
  const { slug, personId } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const decodedPersonId = decodeURIComponent(personId);
  const person = getMemberPersonById(decodedPersonId);
  const organization = getVisibleOrganization(decodedSlug);

  if (!person || !organization) {
    return { title: "Không tìm thấy" };
  }

  return {
    title: `${person.realName} — ${organization.name}`,
    description: `Thông tin và lịch sử phục vụ của ${person.saintName} ${person.realName} tại ${organization.name}.`,
  };
}

export default async function OrganizationMemberDetailPage({
  params,
}: OrganizationMemberDetailPageProps) {
  const { slug, personId } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const decodedPersonId = decodeURIComponent(personId);

  const organization = getVisibleOrganization(decodedSlug);
  const person = getMemberPersonById(decodedPersonId);

  if (
    !organization ||
    !person ||
    !isPersonInOrganization(decodedSlug, decodedPersonId)
  ) {
    notFound();
  }

  const backHref = `/organization/${organization.slug}`;
  const displayName = person.realName;

  return (
    <>
      <PageHeader
        title={displayName}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Đoàn thể", href: "/organization" },
          { label: organization.name, href: backHref },
          { label: "Chi tiết thành viên" },
        ]}
        meta={
          <p className="font-sans text-lg text-white/90">{person.saintName}</p>
        }
      />

      <article className="px-6 py-16 md:py-[120px]">
        <OrganizationMemberDetailView
          person={person}
          backHref={backHref}
          backLabel={`Quay lại ${organization.name}`}
        />
      </article>
    </>
  );
}
