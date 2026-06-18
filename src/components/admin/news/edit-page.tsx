"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewsForm } from "@/components/admin/news/news-form";
import { getToken } from "@/lib/admin/mock-auth";
import { getNewsById, type NewsArticleResponse } from "@/shared/services/news-api";

type AdminNewsEditPageProps = {
  params: Promise<{ id: string }>;
};

export function AdminNewsEditPage({ params }: AdminNewsEditPageProps) {
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    getNewsById(token, id)
      .then(setArticle)
      .catch(() => router.push("/admin/news"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!article) return null;

  return <NewsForm article={article} />;
}
