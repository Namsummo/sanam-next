/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, Eye, EyeOff, Image as ImageIcon, Loader2, Pencil, Upload } from "lucide-react";
import { getToken } from "@/lib/admin/mock-auth";
import {
  getAboutUsSettings,
  updateAboutUsSettings,
  DEFAULT_ABOUT_US_SETTINGS,
  type AboutUsSettingsData,
  type AboutUsMissionItemData,
} from "@/shared/services/about-us-settings-api";
import { uploadImage } from "@/shared/services/news-api";
import { resolveApiUrl } from "@/lib/utils";
import { Input } from "@/components/site/shared/ui/input/input";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";

type ImageUploadTarget = "mainImage" | "authorImage" | "videoThumbnail" | `missionIcon:${number}`;

type AboutZone =
  | "mainImage"
  | "videoThumbnail"
  | "videoUrl"
  | "videoTitle"
  | "subtitle"
  | "title"
  | "description"
  | { type: "missionItem"; index: number }
  | "buttonText"
  | "buttonLink"
  | "authorImage"
  | "authorName"
  | "authorTitle";

function zoneLabel(zone: AboutZone): string {
  if (typeof zone === "string") {
    const labels: Record<string, string> = {
      mainImage: "Ảnh chính",
      videoThumbnail: "Ảnh đại diện video",
      videoUrl: "URL Video (YouTube)",
      videoTitle: "Tiêu đề video",
      subtitle: "Phụ đề",
      title: "Tiêu đề",
      description: "Mô tả",
      buttonText: "Nội dung nút",
      buttonLink: "Đường dẫn nút",
      authorImage: "Ảnh tác giả",
      authorName: "Tên tác giả",
      authorTitle: "Chức danh tác giả",
    };
    return labels[zone] ?? zone;
  }
  return `Mục #${zone.index + 1}`;
}

function resolveAboutImageSrc(uploadUrl?: string, url?: string) {
  return resolveApiUrl(uploadUrl?.trim() || url || "");
}

export function AboutUsSectionEditor() {
  const [settings, setSettings] = useState<AboutUsSettingsData>(DEFAULT_ABOUT_US_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<ImageUploadTarget | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<AboutZone | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAboutUsSettings();
      setSettings(data);
    } catch {
      setSettings(DEFAULT_ABOUT_US_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function handleFieldChange(field: string, value: string) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  function handleMissionFieldChange(index: number, field: keyof AboutUsMissionItemData, value: string) {
    setSettings((prev) => {
      const items = [...prev.missionItems];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, missionItems: items };
    });
  }

  function handleVisibilityToggle(field: keyof typeof settings.visibility) {
    setSettings((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, [field]: !prev.visibility[field] },
    }));
  }

  async function handleSave() {
    const token = getToken();
    if (!token) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await updateAboutUsSettings(token, settings);
      setSettings(updated);
      setSelectedZone(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(target: ImageUploadTarget) {
    const token = getToken();
    if (!token) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/gif,image/webp";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        setUploading(target);
        setError(null);
        const url = await uploadImage(token, file);
        if (target === "mainImage") {
          handleFieldChange("mainImageUploadUrl", url);
        } else if (target === "authorImage") {
          handleFieldChange("authorImageUploadUrl", url);
        } else if (target === "videoThumbnail") {
          handleFieldChange("videoThumbnailUploadUrl", url);
        } else if (target.startsWith("missionIcon:")) {
          const index = Number.parseInt(target.split(":")[1] ?? "", 10);
          if (!Number.isNaN(index)) {
            handleMissionFieldChange(index, "iconUploadUrl", url);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(null);
      }
    };

    input.click();
  }

  function renderImageUploadPreview(src: string) {
    if (!src.trim()) return null;

    return (
      <div className="overflow-hidden rounded-[12px] border border-border bg-muted/20">
        <img src={resolveApiUrl(src)} alt="Xem trước" className="max-h-56 w-full object-cover" />
      </div>
    );
  }

  function renderEditPanel() {
    if (!selectedZone) {
      return (
        <div className="flex h-full items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">Click vào phần tử trong khung xem trước để chỉnh sửa</p>
        </div>
      );
    }

    const zoneType = typeof selectedZone === "string" ? selectedZone : selectedZone.type;

    return (
      <div className="space-y-5">
        <h3 className="font-display text-lg font-semibold text-card-foreground">{zoneLabel(selectedZone)}</h3>

        {zoneType === "mainImage" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">URL ảnh chính</label>
              <button type="button" onClick={() => handleVisibilityToggle("mainImage")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.mainImage ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.mainImageUrl}
                onChange={(e) => handleFieldChange("mainImageUrl", e.target.value)}
                className="min-w-0 flex-1 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="/images/about-us-image-1.jpg"
              />
              <button
                type="button"
                onClick={() => handleImageUpload("mainImage")}
                disabled={uploading === "mainImage"}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading === "mainImage" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Tải lên
              </button>
            </div>
            {settings.mainImageUploadUrl ? (
              <div className="mt-3">
                <p className="mb-1.5 text-xs text-muted-foreground">Ảnh đã tải lên</p>
                {renderImageUploadPreview(settings.mainImageUploadUrl)}
              </div>
            ) : null}
          </div>
        )}

        {zoneType === "videoThumbnail" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">URL ảnh đại diện video</label>
              <button type="button" onClick={() => handleVisibilityToggle("video")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.video ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.videoThumbnailUrl}
                onChange={(e) => handleFieldChange("videoThumbnailUrl", e.target.value)}
                className="min-w-0 flex-1 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="/images/about-us-video-image.jpg"
              />
              <button
                type="button"
                onClick={() => handleImageUpload("videoThumbnail")}
                disabled={uploading === "videoThumbnail"}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading === "videoThumbnail" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Tải lên
              </button>
            </div>
            {settings.videoThumbnailUploadUrl ? (
              <div className="mt-3">
                <p className="mb-1.5 text-xs text-muted-foreground">Ảnh đã tải lên</p>
                {renderImageUploadPreview(settings.videoThumbnailUploadUrl)}
              </div>
            ) : null}
          </div>
        )}

        {zoneType === "videoUrl" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">URL Video (YouTube)</label>
              <button type="button" onClick={() => handleVisibilityToggle("video")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.video ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <input type="text" value={settings.videoUrl} onChange={(e) => handleFieldChange("videoUrl", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" placeholder="https://www.youtube.com/watch?v=..." />
          </div>
        )}

        {zoneType === "videoTitle" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">Tiêu đề video</label>
              <button type="button" onClick={() => handleVisibilityToggle("video")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.video ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <Input type="text" value={settings.videoTitle} onChange={(e) => handleFieldChange("videoTitle", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {zoneType === "subtitle" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">Phụ đề</label>
              <button type="button" onClick={() => handleVisibilityToggle("subtitle")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.subtitle ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <Input type="text" value={settings.subtitle} onChange={(e) => handleFieldChange("subtitle", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {zoneType === "title" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">Tiêu đề</label>
              <button type="button" onClick={() => handleVisibilityToggle("title")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.title ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <Textarea rows={3} value={settings.title} onChange={(e) => handleFieldChange("title", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {zoneType === "description" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">Mô tả</label>
              <button type="button" onClick={() => handleVisibilityToggle("description")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.description ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <Textarea
              rows={8}
              value={settings.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="min-h-[200px] w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
        )}

        {zoneType === "missionItem" && typeof selectedZone !== "string" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-[10px] border border-border bg-muted/50 px-3 py-2">
              <span className="text-sm font-medium text-card-foreground">Hiển thị sứ mệnh</span>
              <button type="button" onClick={() => handleVisibilityToggle("missionItems")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.missionItems ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">URL Icon</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={settings.missionItems[selectedZone.index]?.iconUrl ?? ""}
                  onChange={(e) => handleMissionFieldChange(selectedZone.index, "iconUrl", e.target.value)}
                  className="min-w-0 flex-1 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => handleImageUpload(`missionIcon:${selectedZone.index}`)}
                  disabled={uploading === `missionIcon:${selectedZone.index}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading === `missionIcon:${selectedZone.index}` ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  Tải lên
                </button>
              </div>
              {settings.missionItems[selectedZone.index]?.iconUploadUrl ? (
                <div className="mt-3">
                  <p className="mb-1.5 text-xs text-muted-foreground">Icon đã tải lên</p>
                  {renderImageUploadPreview(settings.missionItems[selectedZone.index]?.iconUploadUrl ?? "")}
                </div>
              ) : null}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Tiêu đề</label>
              <Input type="text" value={settings.missionItems[selectedZone.index]?.title ?? ""}
                onChange={(e) => handleMissionFieldChange(selectedZone.index, "title", e.target.value)}
                className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Mô tả</label>
              <Textarea
                rows={6}
                value={settings.missionItems[selectedZone.index]?.description ?? ""}
                onChange={(e) => handleMissionFieldChange(selectedZone.index, "description", e.target.value)}
                className="min-h-[140px] w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>
        )}

        {(zoneType === "buttonText" || zoneType === "buttonLink") && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">
                {zoneType === "buttonText" ? "Nội dung nút" : "Đường dẫn nút"}
              </label>
              <button type="button" onClick={() => handleVisibilityToggle("button")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.button ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <input type="text" value={zoneType === "buttonText" ? settings.buttonText : settings.buttonLink}
              onChange={(e) => handleFieldChange(zoneType === "buttonText" ? "buttonText" : "buttonLink", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" placeholder={zoneType === "buttonLink" ? "/introduce" : ""} />
          </div>
        )}

        {zoneType === "authorImage" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">URL ảnh tác giả</label>
              <button type="button" onClick={() => handleVisibilityToggle("author")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.author ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.authorImageUrl}
                onChange={(e) => handleFieldChange("authorImageUrl", e.target.value)}
                className="min-w-0 flex-1 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="/images/author-1.jpg"
              />
              <button
                type="button"
                onClick={() => handleImageUpload("authorImage")}
                disabled={uploading === "authorImage"}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading === "authorImage" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Tải lên
              </button>
            </div>
            {settings.authorImageUploadUrl ? (
              <div className="mt-3">
                <p className="mb-1.5 text-xs text-muted-foreground">Ảnh đã tải lên</p>
                {renderImageUploadPreview(settings.authorImageUploadUrl)}
              </div>
            ) : null}
          </div>
        )}

        {zoneType === "authorName" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">Tên tác giả</label>
              <button type="button" onClick={() => handleVisibilityToggle("author")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.author ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <Input type="text" value={settings.authorName} onChange={(e) => handleFieldChange("authorName", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {zoneType === "authorTitle" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">Chức danh tác giả</label>
              <button type="button" onClick={() => handleVisibilityToggle("author")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.author ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <Input type="text" value={settings.authorTitle} onChange={(e) => handleFieldChange("authorTitle", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {selectedZone && (
          <div className="border-t border-border pt-4">
            <button type="button" onClick={handleSave} disabled={saving}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-[10px] bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Lưu
            </button>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <>
      {error && (
        <p className="mb-4 flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="size-3.5" /> {error}
        </p>
      )}
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-[20px] border border-border">
            <div className="scale-[0.55] origin-top-left" style={{ width: `${100 / 0.55}%` }}>
              <AboutUsPreview settings={settings} selectedZone={selectedZone} onSelectZone={setSelectedZone} />
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[380px] shrink-0">
          <div className="sticky top-6 rounded-[20px] border border-border bg-card p-5">
            <div className="mb-5 border-b border-border pb-4">
              <h2 className="font-display text-base font-semibold text-card-foreground">Chỉnh sửa</h2>
              {selectedZone && <p className="mt-0.5 text-xs text-muted-foreground">Đang chỉnh sửa: {zoneLabel(selectedZone)}</p>}
            </div>
            <div className="min-h-[200px]">{renderEditPanel()}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function AboutUsPreview({ settings, selectedZone, onSelectZone }: {
  settings: AboutUsSettingsData;
  selectedZone: AboutZone | null;
  onSelectZone: (zone: AboutZone) => void;
}) {
  return (
    <div className="about-us !py-[60px] !px-0">
      <div className="container mx-auto max-w-[1300px] px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full xl:w-1/2 px-4">
            <div className="about-us-image-box !mr-0">
              <div className={`about-us-image ${!settings.visibility.mainImage ? "opacity-40" : ""}`}>
                <button type="button" onClick={() => onSelectZone("mainImage")}
                  className={`image-anime relative block w-full aspect-[570/517] min-h-[400px] rounded-[20px] overflow-hidden transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "mainImage" ? "ring-2 ring-accent" : ""}`}>
                  <img
                    src={resolveAboutImageSrc(settings.mainImageUploadUrl, settings.mainImageUrl)}
                    alt="About Us"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm"><ImageIcon className="mr-1 inline-block size-3" />Ảnh chính</span>
                </button>
              </div>

              <div className={`about-us-video-box ${!settings.visibility.video ? "opacity-40" : ""}`}>
                <div className="about-video-image relative w-full aspect-[215/130]">
                  <button type="button" onClick={() => onSelectZone("videoThumbnail")}
                    className={`relative block w-full h-full rounded-[10px] overflow-hidden transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "videoThumbnail" ? "ring-2 ring-accent" : ""}`}>
                    <img
                      src={resolveAboutImageSrc(settings.videoThumbnailUploadUrl, settings.videoThumbnailUrl)}
                      alt="Video Cover"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <button type="button" onClick={() => onSelectZone("videoUrl")}
                    className="video-play-button !cursor-pointer" aria-label="Xem video">
                    <span className="popup-video bg-effect flex items-center justify-center w-[28px] h-[28px] rounded-full bg-[var(--accent-color)]">
                      <svg className="size-3 fill-current text-white ml-[2px]" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
                    </span>
                  </button>
                </div>
                <div className="about-video-content">
                  <button type="button" onClick={() => onSelectZone("videoTitle")}
                    className={`w-full text-center font-display font-semibold text-lg text-primary transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "videoTitle" ? "ring-2 ring-accent" : ""}`}>
                    {settings.videoTitle} <Pencil className="ml-1 inline-block size-3 opacity-60" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-1/2 px-4">
            <div className="about-us-content xl:pl-10">
              <div className="section-title">
                <button type="button" onClick={() => onSelectZone("subtitle")}
                  className={`section-sub-title !cursor-pointer text-left transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "subtitle" ? "ring-2 ring-accent" : ""} ${!settings.visibility.subtitle ? "opacity-40" : ""}`}>
                  {settings.subtitle} <Pencil className="ml-2 inline-block size-3 opacity-60" />
                </button>
                <button type="button" onClick={() => onSelectZone("title")}
                  className={`block w-full text-left font-display font-semibold text-3xl md:text-4xl text-[var(--primary-color)] leading-tight transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "title" ? "ring-2 ring-accent" : ""} ${!settings.visibility.title ? "opacity-40" : ""}`}>
                  {settings.title} <Pencil className="ml-2 inline-block size-3 opacity-60" />
                </button>
                <button type="button" onClick={() => onSelectZone("description")}
                  className={`mt-4 block w-full text-left font-sans text-base text-[var(--foreground)] leading-relaxed transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "description" ? "ring-2 ring-accent" : ""} ${!settings.visibility.description ? "opacity-40" : ""}`}>
                  {settings.description} <Pencil className="ml-2 inline-block size-3 opacity-60" />
                </button>
              </div>

              <div className={`about-us-item-list ${!settings.visibility.missionItems ? "opacity-40" : ""}`}>
                {settings.missionItems.map((item, index) => (
                  <div key={index} className="about-us-item !w-[calc(50%-15px)]">
                    <button type="button" onClick={() => onSelectZone({ type: "missionItem", index })}
                      className={`icon-box shrink-0 !cursor-pointer transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone && typeof selectedZone !== "string" && selectedZone.type === "missionItem" && selectedZone.index === index ? "ring-2 ring-accent" : ""}`}>
                      <img
                        src={resolveAboutImageSrc(item.iconUploadUrl, item.iconUrl)}
                        alt={item.title}
                        className="w-6 h-6"
                      />
                    </button>
                    <div className="about-us-item-content">
                      <h3 className="font-display font-semibold text-lg text-[var(--primary-color)]">{item.title}</h3>
                      <p className="font-sans text-sm text-[var(--foreground)] leading-relaxed mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="about-us-footer">
                <div className={`about-us-btn ${!settings.visibility.button ? "opacity-40" : ""}`}>
                  <button type="button" onClick={() => onSelectZone("buttonText")}
                    className={`btn-default transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "buttonText" ? "ring-2 ring-accent" : ""}`}>
                    {settings.buttonText} <Pencil className="ml-2 inline-block size-3 opacity-60" />
                  </button>
                </div>

                <div className={`about-author-box ${!settings.visibility.author ? "opacity-40" : ""}`}>
                  <button type="button" onClick={() => onSelectZone("authorImage")}
                    className={`about-author-image overflow-hidden rounded-full w-[50px] h-[50px] relative transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "authorImage" ? "ring-2 ring-accent" : ""}`}>
                    <img
                      src={resolveAboutImageSrc(settings.authorImageUploadUrl, settings.authorImageUrl)}
                      alt={settings.authorName}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="about-author-content">
                    <button type="button" onClick={() => onSelectZone("authorName")}
                      className={`w-full text-left font-display font-semibold text-lg text-[var(--primary-color)] leading-none transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "authorName" ? "ring-2 ring-accent" : ""}`}>
                      {settings.authorName} <Pencil className="ml-1 inline-block size-3 opacity-60" />
                    </button>
                    <button type="button" onClick={() => onSelectZone("authorTitle")}
                      className={`mt-1 w-full text-left font-sans text-sm text-[var(--foreground)]/80 leading-none transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "authorTitle" ? "ring-2 ring-accent" : ""}`}>
                      {settings.authorTitle} <Pencil className="ml-1 inline-block size-3 opacity-60" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
