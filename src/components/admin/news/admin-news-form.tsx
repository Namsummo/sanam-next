"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Star, X, Tag } from "lucide-react";
import { BlogEditor } from "@/components/admin/shared/blog-editor";
import { ImageUploader } from "@/components/admin/shared/image-uploader";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Button } from "@/components/site/shared/ui/button/button";
import { getAccessToken, getCurrentUser } from "@/lib/admin/auth-session";
import {
  createNews,
  updateNews,
  uploadImage,
  getCategories,
  ensureNewsSections,
  createCategory,
  deleteCategory,
  type NewsCategoryResponse,
  type NewsArticleResponse,
} from "@/shared/services/news-api";
import { slugify } from "@/shared/lib/slugify";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";
import { Input } from "@/components/site/shared/ui/input/input";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import { AdminDateInput } from "../shared/admin-datetime-input";

type AdminNewsFormModalProps = {
  open: boolean;
  article?: NewsArticleResponse | null;
  onClose: () => void;
  onSaved: () => void;
};

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden>
      *
    </span>
  );
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-card-foreground"
    >
      {children}
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h3>
  );
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateInputValue(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toPublishedAtIso(date: string) {
  return new Date(`${date}T00:00:00`).toISOString();
}

export function AdminNewsFormModal({
  open,
  article,
  onClose,
  onSaved,
}: AdminNewsFormModalProps) {
  const router = useRouter();
  const isEdit = Boolean(article);

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const contentFormat = "html" as const;
  const [categoryId, setCategoryId] = useState(article?.categoryId?._id ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(article?.coverImage ?? null);
  const [publishedDate, setPublishedDate] = useState(toDateInputValue(article?.publishedAt));
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
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);

  const sessionUser = getCurrentUser();
  const isAdmin = sessionUser?.role === "admin";

  useEffect(() => {
    if (!open) return;

    async function loadCategories() {
      try {
        const existing = await getCategories();
        const token = getAccessToken();
        setCategories(token ? await ensureNewsSections(token, existing) : existing);
      } catch {
        setCategories([]);
      }
    }

    loadCategories();
  }, [open]);

  async function handleConfirmDeleteCategory() {
    if (!deletingCategoryId) return;
    const token = getAccessToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setDeletingCategory(true);
    try {
      await deleteCategory(token, deletingCategoryId);
      setCategories((prev) => prev.filter((item) => item._id !== deletingCategoryId));
      if (categoryId === deletingCategoryId) {
        setCategoryId("");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Không thể xóa danh mục.");
    } finally {
      setDeletingCategory(false);
      setDeletingCategoryId(null);
    }
  }

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
    const token = getAccessToken();
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
      const token = getAccessToken();
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
        publishedAt: toPublishedAtIso(publishedDate),
        isFeatured,
        isVisible,
      };

      if (isEdit && article) {
        await updateNews(token, article._id, data);
      } else {
        await createNews(token, data);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminFormDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) onClose();
        }}
        title={isEdit ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        className="sm:max-w-4xl"
        footer={
          <div className="flex items-center justify-end gap-3">
            <AdminOutlineButton onClick={onClose} className="h-11 font-bold uppercase">
              Hủy
            </AdminOutlineButton>
            <Button
              variant="primary"
              type="submit"
              form="admin-news-form"
              showIcon={false}
              disabled={saving}
              className="h-11"
            >
              {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Đăng bài"}
            </Button>
          </div>
        }
      >
        <form id="admin-news-form" onSubmit={handleSubmit} className="space-y-6" noValidate>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {/* Thông tin cơ bản */}
          <section>
            <SectionTitle>Thông tin cơ bản</SectionTitle>
            <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
              <div>
                <FieldLabel>
                  Tiêu đề <RequiredMark />
                </FieldLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>Đường dẫn</FieldLabel>
                  <Input
                    value={displayedSlug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="tu-dong-tao-tu-tieu-de"
                  />
                </div>

                <div>
                  <FieldLabel>Danh mục</FieldLabel>
                  <AdminSelect
                    value={categoryId}
                    onChange={setCategoryId}
                    options={categories.map((cat) => ({
                      value: cat._id,
                      label: cat.label,
                      showDelete: cat.articleCount === 0,
                    }))}
                    placeholder="Chọn danh mục"
                    searchable={categories.length > 5}
                    onAdd={isAdmin ? () => setShowNewCategory(true) : undefined}
                    addLabel="Thêm danh mục mới"
                    onDeleteOption={(id) => setDeletingCategoryId(id)}
                  />
                </div>
              </div>

              {showNewCategory ? (
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
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
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {catError ? (
                    <div className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {catError}
                    </div>
                  ) : null}

                  <div className="grid gap-3 p-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Tên danh mục
                      </label>
                      <Input
                        value={newCatLabel}
                        onChange={(e) => setNewCatLabel(e.target.value)}
                        placeholder="VD: Mục vụ"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Slug
                      </label>
                      <Input
                        value={newCatSlug}
                        onChange={(e) => setNewCatSlug(e.target.value)}
                        placeholder={newCatAutoSlug || "tu-dong-theo-ten"}
                      />
                      {!newCatSlug && newCatAutoSlug ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Tự động:{" "}
                          <span className="font-mono text-accent">{newCatAutoSlug}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-border px-4 py-3">
                    <button
                      type="button"
                      disabled={creatingCategory}
                      onClick={async () => {
                        const token = getAccessToken();
                        if (!token) return;

                        const nextSlug = newCatSlug.trim() || newCatAutoSlug;
                        if (!newCatLabel.trim() || !nextSlug) {
                          setCatError("Vui lòng nhập tên danh mục");
                          return;
                        }

                        setCreatingCategory(true);
                        setCatError("");

                        try {
                          const cat = await createCategory(token, {
                            slug: nextSlug,
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
                      className="rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
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
                      className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : null}

              <div>
                <FieldLabel>Mô tả ngắn</FieldLabel>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Mô tả ngắn hiển thị trên danh sách tin..."
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* Xuất bản */}
          <section>
            <SectionTitle>Xuất bản</SectionTitle>
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <FieldLabel>Ngày đăng</FieldLabel>
                  <AdminDateInput
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                  />
                </div>

                <label className="flex cursor-pointer items-end">
                  <span className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm text-card-foreground transition-colors hover:border-accent">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="size-4 accent-accent"
                    />
                    <Star className="size-4 shrink-0 text-accent" />
                    <span>Bài nổi bật</span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-end">
                  <span className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm text-card-foreground transition-colors hover:border-accent">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={(e) => setIsVisible(e.target.checked)}
                      className="size-4 accent-accent"
                    />
                    {isVisible ? (
                      <Eye className="size-4 shrink-0 text-green-600" />
                    ) : (
                      <EyeOff className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span>Hiển thị</span>
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* Media & nội dung */}
          <section>
            <SectionTitle>Ảnh bìa & nội dung</SectionTitle>
            <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
              <div>
                <FieldLabel>Ảnh bìa</FieldLabel>
                <ImageUploader
                  value={coverImage}
                  onChange={setCoverImage}
                  onUpload={handleImageUpload}
                />
              </div>

              <div>
                <FieldLabel>
                  Nội dung <RequiredMark />
                </FieldLabel>
                <BlogEditor content={content} onChange={setContent} />
              </div>
            </div>
          </section>
        </form>
      </AdminFormDialog>

      <AdminConfirmDialog
        open={deletingCategoryId !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setDeletingCategoryId(null);
        }}
        title="Xóa danh mục tin tức?"
        description="Hành động này sẽ xóa vĩnh viễn danh mục này khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?"
        confirmLabel="Xóa"
        onConfirm={handleConfirmDeleteCategory}
        loading={deletingCategory}
        variant="danger"
      />
    </>
  );
}