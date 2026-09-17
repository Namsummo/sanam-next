import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NewsListing } from "@/components/site/news/news-listing";
import { getNewsSectionBySlug, getNewsSectionHref } from "@/lib/news/categories";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức, thông báo và hoạt động của Giáo xứ Sa Nam",
};

function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function NewsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageStr = firstSearchParam(searchParams.page);
  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const category = firstSearchParam(searchParams.category);
  const search = firstSearchParam(searchParams.search)?.trim() || undefined;
  const section = getNewsSectionBySlug(category);

  if (section) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    redirect(`${getNewsSectionHref(section.id)}${qs ? `?${qs}` : ""}`);
  }

  return <NewsListing search={search} page={page} />;
}
