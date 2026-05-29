import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { notFound } from "next/navigation";
import { OrganizationMembersPanel } from "@/components/site/organization/organization-members-panel";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { formatMemberCount } from "@/lib/format";
import { getOrganizationMembersBySlug } from "@/lib/organization/mock-organization-members";
import {
  getOrganizationBySlug,
  getVisibleOrganizations,
} from "@/lib/organization/mock-organizations";
import type { Organization } from "@/lib/organization/types";

type OrganizationDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function getVisibleOrganizationBySlug(slug: string): Organization | undefined {
  const organization = getOrganizationBySlug(slug);
  if (!organization || !organization.isVisible) {
    return undefined;
  }
  return organization;
}

export function generateStaticParams() {
  return getVisibleOrganizations().map((organization) => ({
    slug: organization.slug,
  }));
}

export async function generateMetadata({
  params,
}: OrganizationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const organization = getVisibleOrganizationBySlug(decodeURIComponent(slug));

  if (!organization) {
    return { title: "Không tìm thấy" };
  }

  return {
    title: organization.name,
    description: organization.description,
  };
}

export default async function OrganizationDetailPage({
  params,
}: OrganizationDetailPageProps) {
  const { slug } = await params;
  const organization = getVisibleOrganizationBySlug(decodeURIComponent(slug));

  if (!organization) {
    notFound();
  }

  const members = getOrganizationMembersBySlug(organization.slug);

  return (
    <>
      <PageHeader
        title={organization.name}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Đoàn thể", href: "/organization" },
          { label: organization.name },
        ]}
        meta={
          <p className="flex items-center justify-center gap-2 font-sans text-lg text-white">
            <Users className="size-[18px] shrink-0" aria-hidden />
            <span>{formatMemberCount(organization.memberCount)}</span>
          </p>
        }
      />

      <article className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1300px]">
          {organization.description ? (
            <p className="mx-auto mb-12 max-w-[800px] text-center font-sans text-lg leading-relaxed text-foreground md:mb-16">
              {organization.description}
            </p>
          ) : null}

          <OrganizationMembersPanel
            members={members}
            organizationSlug={organization.slug}
          />

          <div className="mt-14 border-t border-border pt-10 md:mt-16">
            <Link
              href="/organization"
              className="font-display text-base font-semibold uppercase text-primary transition-colors hover:text-accent"
            >
              ← Quay lại đoàn thể
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
