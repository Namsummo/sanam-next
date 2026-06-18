"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/site/shared/ui/dialog/dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";

type AdminConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  variant?: "danger" | "default";
};

export function AdminConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  onConfirm,
  loading = false,
  variant = "default",
}: AdminConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false} aria-describedby={undefined}>
        <DialogHeader className="px-4 pt-4 md:px-5">
          <DialogTitle className="font-display text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-4 pb-4 pt-2 md:px-5">
          <div className="flex w-full items-center justify-end gap-3">
            <AdminOutlineButton onClick={() => onOpenChange(false)} disabled={loading}>
              {cancelLabel}
            </AdminOutlineButton>
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className={
                variant === "danger"
                  ? "inline-flex h-10 items-center justify-center rounded-[10px] bg-destructive px-4 text-sm font-semibold text-white transition-colors hover:bg-destructive/90 disabled:opacity-50"
                  : "inline-flex h-10 items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
              }
            >
              {loading ? "Đang xử lý..." : confirmLabel}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
