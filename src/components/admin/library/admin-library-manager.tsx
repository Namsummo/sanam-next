"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/news/image-uploader";
import { uploadImage } from "@/shared/services/news-api";
import { getToken } from "@/lib/admin/mock-auth";
import { getBackgroundSettings, updateBackgroundSettings, type BackgroundSettingsPayload } from "@/shared/services/background-settings-api";

const routesConfig = [
  { key: "introduceBg", title: "Giới thiệu", path: "/introduce" },
  { key: "organizationBg", title: "Đoàn thể", path: "/organization" },
  { key: "eventsBg", title: "Sự kiện", path: "/events" },
  { key: "newsBg", title: "Tin tức", path: "/news" },
  { key: "worshipBg", title: "Video & Livestream", path: "/worship/live" },
  { key: "contactBg", title: "Liên hệ", path: "/contact" },
] as const;

export function AdminLibraryManager() {
  const [data, setData] = useState<BackgroundSettingsPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getBackgroundSettings()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!data) return;
    try {
      setIsSaving(true);
      await updateBackgroundSettings(data);
      alert("Lưu thành công!");
    } catch (error: any) {
      alert(error.message || "Lưu thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof BackgroundSettingsPayload, url: string | null) => {
    setData((prev) => prev ? { ...prev, [field]: url || "" } : null);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const token = getToken();
    if (!token) throw new Error("Not authenticated");
    return uploadImage(token, file);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-4 text-destructive">Lỗi tải dữ liệu.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold text-card-foreground">Thư viện ảnh</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý ảnh nền (dark-section) cho các trang trên website.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-[10px] bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Lưu thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {routesConfig.map((route) => (
          <div key={route.key} className="rounded-[20px] border border-border bg-card p-5">
            <h3 className="mb-1 font-display text-lg font-semibold text-card-foreground">
              {route.title}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">Path: {route.path}</p>
            
            <ImageUploader
              value={data[route.key as keyof BackgroundSettingsPayload]}
              onChange={(url) => handleChange(route.key as keyof BackgroundSettingsPayload, url)}
              onUpload={handleImageUpload}
              className="aspect-video w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
