import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsListing } from "@/components/site/news/news-listing";
import { getNewsSectionBySlug } from "@/lib/news/categories";

type NewsCategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export async function generateMetadata({
  params,
}: NewsCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const section = getNewsSectionBySlug(slug);
  if (!section) {
    return { title: "Không tìm thấy" };
  }

  return {
    title: section.label,
    description: `${section.label} của Giáo xứ Sa Nam`,
  };
}

export default async function NewsCategoryPage({
  params,
  searchParams,
}: NewsCategoryPageProps) {
  const { slug } = await params;
  const section = getNewsSectionBySlug(slug);
  if (!section) {
    notFound();
  }

  const query = await searchParams;
  const pageStr = firstSearchParam(query.page);
  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const search = firstSearchParam(query.search)?.trim() || undefined;

  return <NewsListing categorySlug={section.id} search={search} page={page} />;
}
