"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { BlogEditor } from "@/components/admin/shared/blog-editor";
import { Button } from "@/components/site/shared/ui/button/button";
import { getAccessToken } from "@/lib/admin/auth-session";
import {
  getIntroduceSettings,
  updateIntroduceSettings,
  DEFAULT_INTRODUCE_SETTINGS,
  type IntroduceSettingsData,
} from "@/shared/services/introduce-settings-api";

export function IntroduceEditor() {
  const [settings, setSettings] = useState<IntroduceSettingsData>(DEFAULT_INTRODUCE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIntroduceSettings();
      setSettings(data);
    } catch {
      setSettings(DEFAULT_INTRODUCE_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const token = getAccessToken();
    if (!token) {
      setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      const updated = await updateIntroduceSettings(token, {
        title: settings.title,
        content: settings.content,
      });
      setSettings(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi lưu cài đặt");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="border-b border-border pb-4">
          <h2 className="font-display text-xl font-semibold text-card-foreground">
            Cấu hình nội dung trang Giới thiệu (/introduce)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Chỉnh sửa tiêu đề nổi bật và nội dung chi tiết dạng bài viết hiển thị trên trang Giới thiệu.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
            <Check className="size-4 shrink-0" />
            <span>Đã lưu cài đặt trang Giới thiệu thành công!</span>
          </div>
        )}

        <div>
          <label
            htmlFor="introduce-title"
            className="mb-1.5 block text-sm font-medium text-card-foreground"
          >
            Tiêu đề nổi bật
          </label>
          <input
            id="introduce-title"
            type="text"
            value={settings.title}
            onChange={(e) => setSettings((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Nhập tiêu đề nổi bật (ví dụ: Kinh ông thánh Quan Thầy Venceslao)"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 font-display text-lg font-semibold text-card-foreground placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-card-foreground">
            Nội dung chi tiết (HTML)
          </label>
          <BlogEditor
            content={settings.content}
            onChange={(html) => setSettings((prev) => ({ ...prev, content: html }))}
          />
        </div>

        <div className="flex justify-end gap-3 items-center border-t border-border pt-4">
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            showIcon={false}
            className="h-11 min-w-[120px]"
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Đang lưu...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Check className="size-4" /> Lưu cài đặt
              </span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
