"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { getAccessToken } from "@/lib/admin/auth-session";
import {
  getAllNews,
  deleteNews,
  toggleNewsVisibility,
  type NewsArticleResponse,
  type PaginationInfo,
  getCategories,
  deleteCategory,
  type NewsCategoryResponse,
} from "@/shared/services/news-api";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import {
  AdminNewsFilters,
  type NewsVisibilityFilter,
} from "@/components/admin/news/admin-news-filters";
import {
  AdminNewsTable,
  NEWS_PAGE_SIZE,
} from "@/components/admin/news/admin-news-table";

const SEARCH_DEBOUNCE_MS = 1500;

export function AdminNewsList() {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticleResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [categories, setCategories] = useState<NewsCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState<NewsVisibilityFilter>("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<NewsArticleResponse | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  const loadArticles = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setFetching(true);
    try {
      const data = await getAllNews(token, {
        page,
        limit: NEWS_PAGE_SIZE,
        ...(visibility ? { visibility } : {}),
        ...(categoryFilter ? { categoryId: categoryFilter } : {}),
        ...(search ? { search } : {}),
      });
      setArticles(data.articles);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [categoryFilter, page, router, search, visibility]);

  useEffect(() => {
    async function fetchData() {
      await loadArticles();
    }
    fetchData();
  }, [loadArticles]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const trimmed = searchDraft.trim();

    if (!trimmed) {
      async function fetchData() {
        setSearch("");
        setPage(1);
      }
      fetchData();
      return;
    }

    const timer = window.setTimeout(() => {
      setSearch(trimmed);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchDraft]);

  function handleSearchSubmit() {
    setSearch(searchDraft.trim());
    setPage(1);
  }

  function handleClearFilters() {
    setSearchDraft("");
    setSearch("");
    setVisibility("");
    setCategoryFilter("");
    setPage(1);
  }

  function handleVisibilityChange(value: NewsVisibilityFilter) {
    setVisibility(value);
    setPage(1);
  }

  function handleCategoryFilterChange(value: string) {
    setCategoryFilter(value);
    setPage(1);
  }

  async function handleToggleVisibility(id: string) {
    const token = getAccessToken();
    if (!token) return;

    try {
      const result = await toggleNewsVisibility(token, id);
      setArticles((prev) =>
        prev.map((article) =>
          article._id === id ? { ...article, isVisible: result.isVisible } : article,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
    }
  }

  function handleDelete(id: string) {
    const target = articles.find((article) => article._id === id);
    if (target) setDeleteTarget(target);
  }

  async function confirmDelete() {
    const token = getAccessToken();
    if (!token || !deleteTarget) return;

    try {
      setDeleting(true);
      await deleteNews(token, deleteTarget._id);
      setDeleteTarget(null);
      await loadArticles();
    } catch (err) {
      console.error("Failed to delete article:", err);
    } finally {
      setDeleting(false);
    }
  }

  async function handleConfirmDeleteCategory() {
    const token = getAccessToken();
    if (!deletingCategoryId) return;
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setDeletingCategory(true);
    try {
      await deleteCategory(token, deletingCategoryId);
      setCategories((prev) => prev.filter((category) => category._id !== deletingCategoryId));
      if (categoryFilter === deletingCategoryId) {
        setCategoryFilter("");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Không thể xóa danh mục.");
    } finally {
      setDeletingCategory(false);
      setDeletingCategoryId(null);
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

      <AdminNewsFilters
        searchDraft={searchDraft}
        visibility={visibility}
        categoryFilter={categoryFilter}
        categories={categories}
        onSearchDraftChange={setSearchDraft}
        onSearchSubmit={handleSearchSubmit}
        onVisibilityChange={handleVisibilityChange}
        onCategoryFilterChange={handleCategoryFilterChange}
        onClear={handleClearFilters}
        onDeleteCategory={setDeletingCategoryId}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            {search || visibility || categoryFilter
              ? "Không tìm thấy bài viết phù hợp."
              : (
                <>
                  Chưa có bài viết nào.{" "}
                  <Link href="/admin/news/create" className="text-accent hover:underline">
                    Tạo bài viết đầu tiên
                  </Link>
                </>
              )}
          </p>
        </div>
      ) : (
        <AdminNewsTable
          articles={articles}
          pagination={pagination}
          fetching={fetching}
          onPageChange={setPage}
          onEdit={(id) => router.push(`/admin/news/${id}/edit`)}
          onToggleVisibility={handleToggleVisibility}
          onDelete={handleDelete}
        />
      )}

      <AdminConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
        title="Xóa bài viết"
        description="Bạn có chắc muốn xóa bài viết này? Hành động không thể hoàn tác."
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        onConfirm={confirmDelete}
        loading={deleting}
        variant="danger"
      />

      <AdminConfirmDialog
        open={deletingCategoryId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingCategoryId(null);
        }}
        title="Xóa danh mục tin tức?"
        description="Hành động này sẽ xóa vĩnh viễn danh mục này khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?"
        confirmLabel="Xóa"
        onConfirm={handleConfirmDeleteCategory}
        loading={deletingCategory}
        variant="danger"
      />
    </div>
  );
}
