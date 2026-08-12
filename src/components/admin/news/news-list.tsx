"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAccessToken } from "@/lib/admin/auth-session";
import {
  getAllNews,
  deleteNews,
  toggleNewsVisibility,
  type NewsArticleResponse,
  type PaginationInfo,
  getCategories,
  type NewsCategoryResponse,
} from "@/shared/services/news-api";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { formatNewsDate } from "@/lib/format";

export function NewsList() {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticleResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [categories, setCategories] = useState<NewsCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const token = getAccessToken();

  useEffect(() => {
    if (!token) {
      router.push("/admin/login");
      return;
    }
    let cancelled = false;
    const fetchArticles = async () => {
      try {
        const data = await getAllNews(token, {
          page,
          limit: 20,
          visibility: visibility as "visible" | "hidden" | undefined,
          categoryId: categoryFilter || undefined,
          search: search || undefined,
        });
        if (cancelled) return;
        setArticles(data.articles);
        setPagination(data.pagination);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch articles:", err);
        setLoading(false);
      }
    };
    fetchArticles();
    return () => {
      cancelled = true;
    };
  }, [token, page, visibility, categoryFilter, search, router]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  async function handleToggleVisibility(id: string) {
    if (!token) return;
    try {
      const result = await toggleNewsVisibility(token, id);
      setArticles((prev) =>
        prev.map((a) => (a._id === id ? { ...a, isVisible: result.isVisible } : a)),
      );
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    try {
      await deleteNews(token, id);
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Failed to delete article:", err);
    }
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      setPage(1);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-card-foreground">
          Quản lý Tin tức
        </h1>
        <Link
          href="/admin/news/create"
          className="inline-flex items-center gap-2 rounded-[10px] bg-accent px-5 py-2.5 font-display text-sm font-semibold uppercase text-white transition-colors hover:bg-accent/90"
        >
          <Plus className="size-4" />
          Thêm bài viết
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full rounded-[12px] border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <AdminSelect
          value={visibility}
          onChange={(v) => {
            setVisibility(v);
            setPage(1);
          }}
          options={[
            { value: "", label: "Tất cả" },
            { value: "visible", label: "Đang hiển thị" },
            { value: "hidden", label: "Đã ẩn" },
          ]}
          placeholder="Trạng thái"
          className="w-44"
        />

        <AdminSelect
          value={categoryFilter}
          onChange={(v) => {
            setCategoryFilter(v);
            setPage(1);
          }}
          options={[
            { value: "", label: "Tất cả danh mục" },
            ...categories.map((cat) => ({
              value: cat._id,
              label: cat.label,
            })),
          ]}
          placeholder="Danh mục"
          className="w-48"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Chưa có bài viết nào.{" "}
            <Link href="/admin/news/create" className="text-accent hover:underline">
              Tạo bài viết đầu tiên
            </Link>
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-3 text-left font-medium text-card-foreground">Tiêu đề</th>
                <th className="px-4 py-3 text-left font-medium text-card-foreground">Danh mục</th>
                <th className="px-4 py-3 text-center font-medium text-card-foreground">Nổi bật</th>
                <th className="px-4 py-3 text-center font-medium text-card-foreground">Hiển thị</th>
                <th className="px-4 py-3 text-left font-medium text-card-foreground">Ngày đăng</th>
                <th className="px-4 py-3 text-right font-medium text-card-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article._id}
                  className="border-b border-border transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/news/${article._id}/edit`}
                      className="font-medium text-card-foreground transition-colors hover:text-accent"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {article.categoryId?.label ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {article.isFeatured ? (
                      <Star className="inline size-4 text-yellow-500" fill="currentColor" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(article._id)}
                      title={article.isVisible ? "Ẩn bài" : "Hiện bài"}
                      className={`transition-colors ${
                        article.isVisible
                          ? "text-green-600 hover:text-green-700"
                          : "text-muted-foreground hover:text-card-foreground"
                      }`}
                    >
                      {article.isVisible ? (
                        <Eye className="inline size-4" />
                      ) : (
                        <EyeOff className="inline size-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatNewsDate(article.publishedAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/news/${article._id}/edit`}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                        title="Sửa"
                      >
                        <Edit className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(article._id)}
                        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Xóa"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination && pagination.totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <span className="text-sm text-muted-foreground">
                Trang {pagination.page} / {pagination.totalPages} ({pagination.total} bài)
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="px-2 text-sm text-muted-foreground">{pagination.page}</span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:opacity-30"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
