"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye, EyeOff, Star, X, Tag } from "lucide-react";
import Link from "next/link";
import { BlogEditor } from "@/components/admin/news/blog-editor";
import { ImageUploader } from "@/components/admin/news/image-uploader";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { getToken, getSessionUser } from "@/lib/admin/mock-auth";
import {
  createNews,
  updateNews,
  uploadImage,
  getCategories,
  createCategory,
  type NewsCategoryResponse,
  type NewsArticleResponse,
} from "@/shared/services/news-api";
import { slugify } from "@/shared/lib/slugify";

type NewsFormProps = {
  article?: NewsArticleResponse;
};

export function NewsForm({ article }: NewsFormProps) {
  const router = useRouter();
  const isEdit = !!article;

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const contentFormat = "html" as const;
  const [categoryId, setCategoryId] = useState<string>(
    article?.categoryId?._id ?? "",
  );
  const [coverImage, setCoverImage] = useState<string | null>(
    article?.coverImage ?? null,
  );
  const [publishedAt, setPublishedAt] = useState(
    article?.publishedAt
      ? new Date(article.publishedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  );
  const [isFeatured, setIsFeatured] = useState(article?.isFeatured ?? false);
  const [isVisible, setIsVisible] = useState(article?.isVisible ?? true);
  const [categories, setCategories] = useState<NewsCategoryResponse[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [catError, setCatError] = useState("");

  const sessionUser = getSessionUser();
  const isAdmin = sessionUser?.role === "admin";

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const displayedSlug = useMemo(() => {
    if (slugManuallyEdited) return slug;
    if (isEdit) return article?.slug ?? slug;
    return slugify(title);
  }, [title, slugManuallyEdited, isEdit, slug, article?.slug]);

  const newCatAutoSlug = useMemo(() => slugify(newCatLabel), [newCatLabel]);

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setSlug(value);
  }

  async function handleImageUpload(file: File): Promise<string> {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    return uploadImage(token, file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }
    if (!content.trim()) {
      setError("Nội dung không được để trống");
      return;
    }

    setSaving(true);

    try {
      const token = getToken();
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const data = {
        title: title.trim(),
        slug: displayedSlug.trim() || undefined,
        excerpt: excerpt.trim(),
        content,
        contentFormat,
        categoryId: categoryId || null,
        coverImage,
        publishedAt: new Date(publishedAt).toISOString(),
        isFeatured,
        isVisible,
      };

      if (isEdit && article) {
        await updateNews(token, article._id, data);
      } else {
        await createNews(token, data);
      }

      router.push("/admin/news");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-card-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Về danh sách tin tức
      </Link>

      <h1 className="mt-4 font-display text-2xl font-semibold text-card-foreground">
        {isEdit ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error ? (
          <div className="rounded-[12px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Tiêu đề *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết"
              className="w-full rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Đường dẫn
            </label>
              <input
                type="text"
                value={displayedSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="tu-dong-tao-tu-tieu-de"
                className="w-full rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Danh mục
            </label>
            <AdminSelect
              value={categoryId}
              onChange={setCategoryId}
              options={categories.map((cat) => ({
                value: cat._id,
                label: cat.label,
              }))}
              placeholder="Chọn danh mục"
              searchable={categories.length > 5}
              onAdd={isAdmin ? () => setShowNewCategory(true) : undefined}
              addLabel="Thêm danh mục mới"
            />

            {showNewCategory ? (
              <div className="mt-3 overflow-hidden rounded-[12px] border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                    <Tag className="size-4 text-accent" />
                    Danh mục mới
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCatLabel("");
                      setNewCatSlug("");
                      setCatError("");
                    }}
                    className="text-muted-foreground transition-colors hover:text-card-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {catError ? (
                  <div className="mx-4 mt-3 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {catError}
                  </div>
                ) : null}

                <div className="p-4">
                  <div className="mb-3">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Tên danh mục
                    </label>
                    <input
                      type="text"
                      value={newCatLabel}
                      onChange={(e) => setNewCatLabel(e.target.value)}
                      placeholder="VD: Mục vụ"
                      className="w-full rounded-[8px] border border-border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={newCatSlug}
                      onChange={(e) => setNewCatSlug(e.target.value)}
                      placeholder={newCatAutoSlug || "tu-dong-theo-ten"}
                      className="w-full rounded-[8px] border border-border bg-background px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20"
                    />
                    {!newCatSlug && newCatAutoSlug ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Slug tự động: <span className="font-mono text-accent">{newCatAutoSlug}</span>
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={creatingCategory}
                      onClick={async () => {
                        const token = getToken();
                        if (!token) return;

                        const slug = newCatSlug.trim() || newCatAutoSlug;
                        if (!newCatLabel.trim() || !slug) {
                          setCatError("Vui lòng nhập tên danh mục");
                          return;
                        }

                        setCreatingCategory(true);
                        setCatError("");

                        try {
                          const cat = await createCategory(token, {
                            slug,
                            label: newCatLabel.trim(),
                          });
                          setCategories((prev) => [...prev, cat]);
                          setCategoryId(cat._id);
                          setShowNewCategory(false);
                          setNewCatLabel("");
                          setNewCatSlug("");
                        } catch (err) {
                          setCatError(
                            err instanceof Error ? err.message : "Lỗi tạo danh mục",
                          );
                        } finally {
                          setCreatingCategory(false);
                        }
                      }}
                      className="rounded-[8px] bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
                    >
                      {creatingCategory ? "Đang tạo..." : "Tạo danh mục"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategory(false);
                        setNewCatLabel("");
                        setNewCatSlug("");
                        setCatError("");
                      }}
                      className="text-sm text-muted-foreground transition-colors hover:text-card-foreground"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Ngày đăng
            </label>
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-card-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div className="flex items-end gap-4">
            <label className="flex cursor-pointer items-center gap-2 rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-card-foreground transition-colors hover:border-accent">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="size-4 accent-accent"
              />
              <Star className="size-4 text-accent" />
              <span>Bài nổi bật</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2 rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-card-foreground transition-colors hover:border-accent">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="size-4 accent-accent"
              />
              {isVisible ? (
                <Eye className="size-4 text-green-600" />
              ) : (
                <EyeOff className="size-4 text-muted-foreground" />
              )}
              <span>Hiển thị</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Mô tả ngắn
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Mô tả ngắn cho bài viết..."
              className="w-full resize-none rounded-[12px] border border-border bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Ảnh bìa
            </label>
            <ImageUploader
              value={coverImage}
              onChange={setCoverImage}
              onUpload={handleImageUpload}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">
              Nội dung *
            </label>
            <BlogEditor
              content={content}
              onChange={setContent}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-border pt-6">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-[10px] bg-accent px-6 py-3 font-display text-sm font-semibold uppercase text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            <Save className="size-4" />
            {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Đăng bài"}
          </button>

          <Link
            href="/admin/news"
            className="text-sm text-muted-foreground transition-colors hover:text-card-foreground"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
