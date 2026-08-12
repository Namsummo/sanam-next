"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Plus, Search, EyeIcon, EyeClosedIcon } from "lucide-react";
import {
  AdminUsersTable,
  USERS_PAGE_SIZE,
} from "./admin-users-table";
import {
  getAdminUsers,
  createUser,
  updateUser,
  deleteUser,
  type ApiUser,
  type UserRole,
} from "@/shared/services/users-api";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminConfirmDialog } from "@/components/admin/shared/admin-confirm-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Input } from "@/components/site/shared/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/site/shared/ui/select/select";
import { getAccessToken, getCurrentUser } from "@/lib/admin/auth-session";

const actionButtonClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

const SEARCH_DEBOUNCE_MS = 600;

type FormMode = "create" | "edit";

type FormData = {
  name: string;
  email: string;
  role: UserRole;
  dateOfBirth: string;
  password?: string;
  confirmPassword?: string;
};

const emptyForm: FormData = {
  name: "",
  email: "",
  role: "viewer",
  dateOfBirth: "",
  password: "",
  confirmPassword: "",
};

const ROLE_OPTIONS = [
  { value: "admin", label: "Quản trị viên" },
  { value: "editor", label: "Biên tập viên" },
  { value: "viewer", label: "Người xem" },
] as const;

function toDateInputFormat(dateString?: string) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}

export function AdminUsersManager() {
  const router = useRouter();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Dialog State
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<ApiUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toggle visible passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sessionUser = getCurrentUser();
  const token = typeof window !== "undefined" ? getAccessToken() : null;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const loadUsers = useCallback(async () => {
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      setFetching(true);
      setError(null);

      const trimmedSearch = debouncedSearch.trim();
      const res = await getAdminUsers(token, {
        page,
        limit: USERS_PAGE_SIZE,
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
      });

      setUsers(res.users);
      setTotalItems(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [debouncedSearch, page, token, router]);

  useEffect(() => {
    if (!sessionUser) {
      router.push("/admin/login");
      return;
    }

    if (sessionUser.role !== "admin") return;

    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadUsers, router, sessionUser]);

  // Auth Protection Guard
  if (sessionUser && sessionUser.role !== "admin") {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-card-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Về Tổng quan
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <h2 className="font-display text-xl font-semibold text-destructive">
            Không có quyền truy cập
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tính năng này chỉ dành riêng cho tài khoản có vai trò Quản trị viên (Admin).
          </p>
        </div>
      </div>
    );
  }

  function openCreateForm() {
    setFormMode("create");
    setEditingId(null);
    setFormData(emptyForm);
    setFormError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormOpen(true);
  }

  function handleEdit(user: ApiUser) {
    setFormMode("edit");
    setEditingId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      dateOfBirth: toDateInputFormat(user.dateOfBirth),
      password: "",
      confirmPassword: "",
    });
    setFormError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormOpen(true);
  }

  function handleDelete(user: ApiUser) {
    setDeleteTarget(user);
  }

  async function confirmDelete() {
    if (!deleteTarget || !token) return;

    try {
      setDeleting(true);
      await deleteUser(token, deleteTarget._id);
      setDeleteTarget(null);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa tài khoản thất bại");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSave() {
    setFormError(null);

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.dateOfBirth || !formData.role) {
      setFormError("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormError("Địa chỉ email không hợp lệ");
      return;
    }

    if (formMode === "create") {
      if (!formData.password) {
        setFormError("Vui lòng nhập mật khẩu");
        return;
      }
      if (formData.password.length < 6) {
        setFormError("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setFormError("Xác nhận mật khẩu không trùng khớp");
        return;
      }
    } else {
      // Edit mode: password is optional, but if entered it must meet requirements
      if (formData.password) {
        if (formData.password.length < 6) {
          setFormError("Mật khẩu phải có ít nhất 6 ký tự");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setFormError("Xác nhận mật khẩu không trùng khớp");
          return;
        }
      }
    }

    if (!token) return;

    setSaving(true);

    try {
      if (formMode === "create") {
        await createUser(token, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          dateOfBirth: formData.dateOfBirth,
          password: formData.password,
        });
      } else if (editingId) {
        await updateUser(token, editingId, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          dateOfBirth: formData.dateOfBirth,
          ...(formData.password ? { password: formData.password } : {}),
        });
      }

      setFormOpen(false);
      setFormData(emptyForm);
      await loadUsers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi lưu thông tin");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-card-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Về Tổng quan
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-card-foreground">
              Thành viên Quản trị
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Quản lý danh sách tài khoản được phép đăng nhập và thao tác trên trang Admin.
            </p>
            {error ? (
              <p className="mt-1 text-sm text-destructive">{error}</p>
            ) : null}
          </div>
          <button type="button" className={actionButtonClassName} onClick={openCreateForm}>
            <Plus className="size-4" aria-hidden />
            Thêm tài khoản
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <section className="rounded-[20px] border border-border bg-card p-4 md:p-5">
        <div className="mb-3">
          <span className="text-sm font-medium text-card-foreground">Tìm kiếm thành viên</span>
        </div>
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên hoặc email..."
            className="pl-10"
          />
        </div>
      </section>

      {/* Users Table */}
      <AdminUsersTable
        users={users}
        currentUserId={sessionUser?.id}
        fetching={fetching}
        totalItems={totalItems}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create / Edit Form Dialog */}
      <AdminFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) setFormOpen(false);
        }}
        title={formMode === "create" ? "Tạo tài khoản mới" : "Sửa thông tin tài khoản"}
        footer={
          <div className="flex w-full items-center justify-end gap-3">
            <AdminOutlineButton onClick={() => setFormOpen(false)} disabled={saving}>
              Hủy
            </AdminOutlineButton>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex h-9 items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : formMode === "create" ? "Tạo tài khoản" : "Cập nhật"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {formError ? (
            <p
              role="alert"
              className="rounded-[10px] border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {formError}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-card-foreground">
                Họ và tên <span className="text-destructive">*</span>
              </span>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="VD: Nguyễn Văn A"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-card-foreground">
                Email <span className="text-destructive">*</span>
              </span>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="VD: a.nguyen@example.com"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-card-foreground">
                Ngày sinh <span className="text-destructive">*</span>
              </span>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                }
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-card-foreground">
                Vai trò <span className="text-destructive">*</span>
              </span>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: value as UserRole,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò">
                    {(value: string) =>
                      ROLE_OPTIONS.find((opt) => opt.value === value)?.label ??
                      "Chọn vai trò"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-3">
              {formMode === "edit"
                ? "Bỏ trống mật khẩu nếu không muốn thay đổi."
                : "Thiết lập mật khẩu đăng nhập ban đầu."}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-card-foreground">
                  Mật khẩu {formMode === "create" && <span className="text-destructive">*</span>}
                </span>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="Tối thiểu 6 ký tự"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? (
                      <EyeIcon className="size-4 shrink-0" aria-hidden />
                    ) : (
                      <EyeClosedIcon className="size-4 shrink-0" aria-hidden />
                    )}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-card-foreground">
                  Nhập lại mật khẩu {formMode === "create" && <span className="text-destructive">*</span>}
                </span>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    placeholder="Xác nhận mật khẩu"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setShowConfirmPassword((current) => !current)}
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="size-4 shrink-0" aria-hidden />
                    ) : (
                      <EyeClosedIcon className="size-4 shrink-0" aria-hidden />
                    )}
                  </button>
                </div>
              </label>
            </div>
          </div>
        </div>
      </AdminFormDialog>

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Xóa tài khoản thành viên"
        description={`Bạn có chắc chắn muốn xóa tài khoản của "${deleteTarget?.name}" (${deleteTarget?.email})? Thao tác này không thể thu hồi.`}
        confirmLabel="Xóa tài khoản"
        cancelLabel="Hủy"
        onConfirm={confirmDelete}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
