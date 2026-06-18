"use client";

import { useRouter } from "next/navigation";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/site/shared/ui/button/button";
import { ControlledField, FieldGroup } from "@/components/site/shared/ui/field/field";
import { Input } from "@/components/site/shared/ui/input/input";
import { loginApi } from "@/shared/services/auth-api";
import { getToken, setMockAdminSession } from "@/lib/admin/mock-auth";

type AdminLoginValues = {
  email: string;
  password: string;
};

export function AdminLoginForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace("/admin");
    } else {
      // Defer state update to avoid cascading render warning
      const id = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(id);
    }
  }, [router]);

  const form = useForm<AdminLoginValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) {
    return (
      <p className="text-center text-sm text-muted-foreground">Đang kiểm tra...</p>
    );
  }

  async function onSubmit(values: AdminLoginValues) {
    setError(null);

    try {
      const result = await loginApi(values.email, values.password);
      setMockAdminSession(result.token, result.user);
      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đăng nhập thất bại",
      );
    }
  }

  return (
    <form
      id="admin-login-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      {error ? (
        <p
          role="alert"
          className="rounded-[10px] border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <FieldGroup>
        <ControlledField
          control={form.control}
          name="email"
          label="Email"
          rules={{
            required: "Vui lòng nhập email",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email không hợp lệ",
            },
          }}
        >
          {({ field, fieldState, id }) => (
            <Input
              {...field}
              id={id}
              type="email"
              autoComplete="username"
              aria-invalid={fieldState.invalid}
              placeholder="Email"
            />
          )}
        </ControlledField>

        <ControlledField
          control={form.control}
          name="password"
          label="Mật khẩu"
          rules={{
            required: "Vui lòng nhập mật khẩu",
          }}
        >
          {({ field, fieldState, id }) => (
            <div className="relative w-full">
              <Input
                {...field}
                id={id}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                placeholder="Mật khẩu"
              />
              <button
                type="button"
                className="absolute right-[16px] top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? (
                  <EyeIcon className="size-5 shrink-0" aria-hidden />
                ) : (
                  <EyeClosedIcon className="size-5 shrink-0" aria-hidden />
                )}
              </button>
            </div>
          )}
        </ControlledField>
      </FieldGroup>

      <Button
        type="submit"
        showIcon={false}
        aria-disabled={form.formState.isSubmitting}
        className="w-full justify-center"
      >
        {form.formState.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Đăng nhập bằng tài khoản quản trị
      </p>
    </form>
  );
}
