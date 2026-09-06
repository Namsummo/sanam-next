"use client";

import { useMemo, useState } from "react";
import { Tag, X } from "lucide-react";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Button } from "@/components/site/shared/ui/button/button";
import { Input } from "@/components/site/shared/ui/input/input";
import type { LiturgyFeastRank } from "@/lib/liturgy/types";
import { slugify } from "@/shared/lib/slugify";

type AdminFeastRankFormProps = {
  editing?: LiturgyFeastRank | null;
  onClose: () => void;
};

export function AdminFeastRankForm({
  editing = null,
  onClose,
}: AdminFeastRankFormProps) {
  const isEdit = Boolean(editing);
  const [label, setLabel] = useState(editing?.label ?? "");
  const [slug, setSlug] = useState(editing?.slug ?? "");
  const [slugManual, setSlugManual] = useState(isEdit);

  const autoSlug = useMemo(() => slugify(label), [label]);

  function handleSave() {
    // Mock UI: đóng form, không lưu dữ liệu. Ghép API sau.
    onClose();
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <Tag className="size-4 text-accent" />
          {isEdit ? "Sửa cấp độ" : "Cấp độ mới"}
        </span>
        <Button
          type="button"
          variant="transparent"
          showIcon={false}
          onClick={onClose}
          className="text-muted-foreground transition-colors hover:text-card-foreground"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Tên cấp độ
          </label>
          <Input
            type="text"
            value={label}
            onChange={(e) => {
              const next = e.target.value;
              setLabel(next);
              if (!slugManual) setSlug(slugify(next));
            }}
            placeholder="VD: Lễ trọng"
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
            onChange={(e) => {
              setSlugManual(true);
              setSlug(e.target.value);
            }}
            placeholder={autoSlug || "tu-dong-theo-ten"}
            className="bg-background"
          />
          {!slugManual && autoSlug ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Slug tự động:{" "}
              <span className="font-mono text-accent">{autoSlug}</span>
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <AdminOutlineButton
            type="button"
            onClick={handleSave}
            className="rounded-[8px] bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            {isEdit ? "Cập nhật" : "Tạo cấp độ"}
          </AdminOutlineButton>
          <AdminOutlineButton type="button" onClick={onClose}>
            Hủy
          </AdminOutlineButton>
        </div>
      </div>
    </div>
  );
}
