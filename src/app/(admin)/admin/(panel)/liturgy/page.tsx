import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AdminLiturgyManager } from "@/components/admin/liturgy/admin-liturgy-manager";

export default function AdminLiturgyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Đang tải phụng vụ…
        </div>
      }
    >
      <AdminLiturgyManager />
    </Suspense>
  );
}
