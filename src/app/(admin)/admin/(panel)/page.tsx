import { AdminModuleCard } from "@/components/admin/admin-module-card";
import { adminModules } from "@/lib/admin/modules";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-card-foreground">
          Tổng quan
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Quản lý nội dung website Giáo xứ Sa Nam. Chọn module ở sidebar hoặc
          bên dưới để bắt đầu.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminModules.map((module) => (
          <AdminModuleCard key={module.id} module={module} />
        ))}
      </div>
    </div>
  );
}
