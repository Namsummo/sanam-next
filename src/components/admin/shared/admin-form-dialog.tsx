"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/site/shared/ui/dialog/dialog";
import { cn } from "@/lib/utils";

type AdminFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function AdminFormDialog({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className,
}: AdminFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("max-h-[92vh] gap-0 p-0 sm:max-w-2xl", className)}
        aria-describedby={undefined}
      >
        <DialogHeader className="shrink-0 border-b border-border px-4 py-4 pr-14 md:px-5">
          <DialogTitle className="font-display text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">{children}</div>

        {footer ? (
          <DialogFooter className="shrink-0 border-t border-border px-4 py-4 md:px-5">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
