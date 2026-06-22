"use client";

import { useMemo, useState } from "react";
import { Tag, X } from "lucide-react";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Button } from "@/components/site/shared/ui/button/button";
import { Input } from "@/components/site/shared/ui/input/input";
import { getToken } from "@/lib/admin/mock-auth";
import { slugify } from "@/shared/lib/slugify";
import {
  createEventCategory,
  type ApiEventCategory,
} from "@/shared/services/events-api";

type AdminEventNewCategoryFormProps = {
  onClose: () => void;
  onCreated: (category: ApiEventCategory) => void;
};

export function AdminEventNewCategoryForm({
  onClose,
  onCreated,
}: AdminEventNewCategoryFormProps) {
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const autoSlug = useMemo(() => slugify(label), [label]);

  function handleClose() {
    setLabel("");
    setSlug("");
    setError("");
    onClose();
  }

  async function handleCreate() {
    const token = getToken();
    if (!token) return;

    const resolvedSlug = slug.trim() || autoSlug;
    if (!label.trim() || !resolvedSlug) {
      setError("Vui lòng nhập tên danh mục");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const category = await createEventCategory(token, {
        slug: resolvedSlug,
        label: label.trim(),
      });
      setLabel("");
      setSlug("");
      onCreated(category);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo danh mục");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mt-3 overflow-hidden rounded-[12px] border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <Tag className="size-4 text-accent" />
          Danh mục mới
        </span>
        <Button
          type="button"
          variant="transparent"
          showIcon={false}
          onClick={handleClose}
          className="text-muted-foreground transition-colors hover:text-card-foreground"
        >
          <X className="size-4" />
        </Button>
      </div>

      {error ? (
        <div className="mx-4 mt-3 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      <div className="p-4">
        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Tên danh mục
          </label>
          <Input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="VD: Mục vụ"
            className="bg-background"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Slug
          </label>
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={autoSlug || "tu-dong-theo-ten"}
            className="bg-background"
          />
          {!slug && autoSlug ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Slug tự động:{" "}
              <span className="font-mono text-accent">{autoSlug}</span>
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <AdminOutlineButton
            type="button"
            disabled={creating}
            onClick={handleCreate}
            className="rounded-[8px] bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            {creating ? "Đang tạo..." : "Tạo danh mục"}
          </AdminOutlineButton>
          <AdminOutlineButton type="button" onClick={handleClose}>
            Hủy
          </AdminOutlineButton>
        </div>
      </div>
    </div>
  );
}
