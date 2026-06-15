import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/login/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-[20px] border border-border bg-card p-6 shadow-sm md:p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          Giáo xứ Sa Nam
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-card-foreground">
          Đăng nhập quản trị
        </h1>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-card-foreground hover:underline">
          Quay về website
        </Link>
      </p>
    </div>
  );
}
