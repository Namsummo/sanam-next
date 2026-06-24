import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBackgroundSettings } from "@/shared/services/background-settings-api";
import { PageHeader } from "@/components/site/shared/components/page/page-header";
import { OrganizationMembersPanel } from "@/components/site/organization/organization-members-panel";
import { getOrganizationBySlug, getOrganizations } from "@/lib/organization/api";
import type { Organization } from "@/lib/organization/types";

type OrganizationDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const organizations = await getOrganizations();
  return organizations.map((organization) => ({
    slug: organization.slug,
  }));
}

export async function generateMetadata({
  params,
}: OrganizationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const organization = await getOrganizationBySlug(decodeURIComponent(slug));
    return {
      title: organization.name,
      description: `Chi tiết đoàn thể ${organization.name}`,
    };
  } catch {
    return { title: "Không tìm thấy" };
  }
}

export default async function OrganizationDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);
  const [organization, bgSettings] = await Promise.all([
    getOrganizationBySlug(slug).catch(() => null),
    getBackgroundSettings().catch(() => null),
  ]);

  if (!organization) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={organization.name}
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: "Đoàn thể", href: "/organization" },
          { label: organization.name },
        ]}
        backgroundImage={bgSettings?.organizationBg}
      />

      <article className="px-6 py-16 md:py-[120px]">
        <div className="mx-auto max-w-[1300px]">
          {organization.terms && organization.terms.length > 0 ? (
            <div className="mb-16">
              <OrganizationMembersPanel terms={organization.terms} />
            </div>
          ) : null}

          {organization.history ? (
            <div className="mt-16 border-t border-border pt-16">
              <h2 className="mb-10 text-center font-display text-2xl font-semibold uppercase tracking-tight text-primary md:text-3xl">
                Lịch sử hình thành
              </h2>
              <div 
                className="prose prose-lg mx-auto max-w-[900px] text-foreground prose-headings:font-display prose-headings:text-primary prose-a:text-accent prose-img:rounded-[12px]"
                dangerouslySetInnerHTML={{ __html: organization.history }} 
              />
            </div>
          ) : null}

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
