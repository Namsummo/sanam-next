/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Check, Eye, EyeOff, Image as ImageIcon, Loader2, Pencil, Upload } from "lucide-react";
import { getAccessToken } from "@/lib/admin/auth-session";
import {
  getOurMissionSettings,
  updateOurMissionSettings,
  DEFAULT_OUR_MISSION_SETTINGS,
  type OurMissionSettingsData,
  type OurMissionItem,
} from "@/shared/services/our-mission-settings-api";
import { uploadImage } from "@/shared/services/news-api";
import { resolveApiUrl } from "@/lib/utils";
import { Input } from "@/components/site/shared/ui/input/input";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";

type ImageUploadTarget = "image1" | "image2";

function resolveMissionImageSrc(uploadUrl?: string, url?: string) {
  return resolveApiUrl(uploadUrl?.trim() || url || "");
}

type MissionZone =
  | "subtitle"
  | "title"
  | "description"
  | { type: "missionItem"; index: number }
  | "buttonText"
  | "buttonLink"
  | "contactLabel"
  | "contactPhone"
  | "image1"
  | "image2";

function zoneLabel(zone: MissionZone): string {
  if (typeof zone === "string") {
    const labels: Record<string, string> = {
      subtitle: "Phụ đề",
      title: "Tiêu đề",
      description: "Mô tả",
      buttonText: "Nội dung nút",
      buttonLink: "Đường dẫn nút",
      contactLabel: "Nhãn liên hệ",
      contactPhone: "Số điện thoại",
      image1: "Ảnh lớn 1",
      image2: "Ảnh nhỏ 2",
    };
    return labels[zone] ?? zone;
  }
  return `Mục sứ mệnh #${zone.index + 1}`;
}

export function OurMissionSectionEditor() {
  const [settings, setSettings] = useState<OurMissionSettingsData>(DEFAULT_OUR_MISSION_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<ImageUploadTarget | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<MissionZone | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOurMissionSettings();
      setSettings(data);
    } catch {
      setSettings(DEFAULT_OUR_MISSION_SETTINGS);
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

  function handleMissionFieldChange(index: number, field: keyof OurMissionItem, value: string) {
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
    const token = getAccessToken();
    if (!token) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await updateOurMissionSettings(token, settings);
      setSettings(updated);
      setSelectedZone(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(target: ImageUploadTarget) {
    const token = getAccessToken();
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
        if (target === "image1") {
          handleFieldChange("image1Url", url);
          handleFieldChange("image1UploadUrl", url);
        } else {
          handleFieldChange("image2Url", url);
          handleFieldChange("image2UploadUrl", url);
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
        <img src={src} alt="Xem trước" className="max-h-56 w-full object-cover" />
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
            <Input type="text" value={zoneType === "buttonText" ? settings.buttonText : settings.buttonLink}
              onChange={(e) => handleFieldChange(zoneType === "buttonText" ? "buttonText" : "buttonLink", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {(zoneType === "contactLabel" || zoneType === "contactPhone") && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">
                {zoneType === "contactLabel" ? "Nhãn liên hệ" : "Số điện thoại"}
              </label>
              <button type="button" onClick={() => handleVisibilityToggle("contactInfo")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.contactInfo ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <Input type="text" value={zoneType === "contactLabel" ? settings.contactLabel : settings.contactPhone}
              onChange={(e) => handleFieldChange(zoneType === "contactLabel" ? "contactLabel" : "contactPhone", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {zoneType === "image1" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">URL Ảnh lớn</label>
              <button type="button" onClick={() => handleVisibilityToggle("image1")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.image1 ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={settings.image1Url}
                onChange={(e) => handleFieldChange("image1Url", e.target.value)}
                className="min-w-0 flex-1 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="/images/our-mission-image-1.jpg"
              />
              <button
                type="button"
                onClick={() => handleImageUpload("image1")}
                disabled={uploading === "image1"}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading === "image1" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Tải lên
              </button>
            </div>
            {settings.image1UploadUrl ? (
              <div className="mt-3">
                <p className="mb-1.5 text-xs text-muted-foreground">Ảnh đã tải lên</p>
                {renderImageUploadPreview(settings.image1UploadUrl)}
              </div>
            ) : null}
          </div>
        )}

        {zoneType === "image2" && (
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-card-foreground">URL Ảnh nhỏ</label>
              <button type="button" onClick={() => handleVisibilityToggle("image2")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.image2 ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={settings.image2Url}
                onChange={(e) => handleFieldChange("image2Url", e.target.value)}
                className="min-w-0 flex-1 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="/images/our-mission-image-2.png"
              />
              <button
                type="button"
                onClick={() => handleImageUpload("image2")}
                disabled={uploading === "image2"}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading === "image2" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                Tải lên
              </button>
            </div>
            {settings.image2UploadUrl ? (
              <div className="mt-3">
                <p className="mb-1.5 text-xs text-muted-foreground">Ảnh đã tải lên</p>
                {renderImageUploadPreview(settings.image2UploadUrl)}
              </div>
            ) : null}
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
              <OurMissionPreview settings={settings} selectedZone={selectedZone} onSelectZone={setSelectedZone} />
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

function OurMissionPreview({ settings, selectedZone, onSelectZone }: {
  settings: OurMissionSettingsData;
  selectedZone: MissionZone | null;
  onSelectZone: (zone: MissionZone) => void;
}) {
  return (
    <div className="our-mission !py-[60px] !px-0">
      <div className="container mx-auto max-w-[1300px] px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full xl:w-1/2 px-4">
            <div className="our-mission-content">
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

              <div className={`mission-item-list ${!settings.visibility.missionItems ? "opacity-40" : ""}`}>
                {settings.missionItems.map((item, index) => (
                  <button key={index} type="button" onClick={() => onSelectZone({ type: "missionItem", index })}
                    className={`mission-item !cursor-pointer text-left w-[calc(50%-15px)] transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone && typeof selectedZone !== "string" && selectedZone.type === "missionItem" && selectedZone.index === index ? "ring-2 ring-accent" : ""}`}>
                    <h3 className="font-display font-semibold text-lg text-[var(--primary-color)]">
                      {item.title} <Pencil className="ml-1 inline-block size-3 opacity-60" />
                    </h3>
                    <p className="font-sans text-sm text-[var(--foreground)] leading-relaxed mt-2.5">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="our-mission-footer">
                <div className={`mission-btn ${!settings.visibility.button ? "opacity-40" : ""}`}>
                  <button type="button" onClick={() => onSelectZone("buttonText")}
                    className={`btn-default transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "buttonText" ? "ring-2 ring-accent" : ""}`}>
                    {settings.buttonText} <Pencil className="ml-2 inline-block size-3 opacity-60" />
                  </button>
                </div>

                <div className={`mission-contact-info ${!settings.visibility.contactInfo ? "opacity-40" : ""}`}>
                  <div className="icon-box shrink-0">
                    <img src="/images/icon-phone-white.svg" alt="Phone Icon" className="w-6 h-6" />
                  </div>
                  <div className="mission-contact-info-content">
                    <button type="button" onClick={() => onSelectZone("contactLabel")}
                      className={`w-full text-left font-display font-semibold text-lg text-[var(--primary-color)] leading-none transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "contactLabel" ? "ring-2 ring-accent" : ""}`}>
                      {settings.contactLabel} <Pencil className="ml-1 inline-block size-3 opacity-60" />
                    </button>
                    <button type="button" onClick={() => onSelectZone("contactPhone")}
                      className={`mt-1 w-full text-left font-sans text-sm text-[var(--foreground)] leading-none transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "contactPhone" ? "ring-2 ring-accent" : ""}`}>
                      <span className="font-semibold text-[var(--foreground)]">{settings.contactPhone}</span> <Pencil className="ml-1 inline-block size-3 opacity-60" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-1/2 px-4">
            <div className="our-mission-image-box !mr-0">
              <div className={`mission-image img-1 ${!settings.visibility.image1 ? "opacity-40" : ""}`}>
                <button type="button" onClick={() => onSelectZone("image1")}
                  className={`image-anime relative block w-full aspect-[1/1.8] min-h-[400px] rounded-[20px] overflow-hidden transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "image1" ? "ring-2 ring-accent" : ""}`}>
                  <img
                    src={resolveMissionImageSrc(settings.image1UploadUrl, settings.image1Url)}
                    alt="Our Mission 1"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm"><ImageIcon className="mr-1 inline-block size-3" />Ảnh lớn</span>
                </button>
              </div>

              <div className={`mission-image img-2 ${!settings.visibility.image2 ? "opacity-40" : ""}`}>
                <button type="button" onClick={() => onSelectZone("image2")}
                  className={`relative block w-full aspect-[1/1.9609] min-h-[400px] rounded-[20px] overflow-hidden transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "image2" ? "ring-2 ring-accent" : ""}`}>
                  <img
                    src={resolveMissionImageSrc(settings.image2UploadUrl, settings.image2Url)}
                    alt="Our Mission 2"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm"><ImageIcon className="mr-1 inline-block size-3" />Ảnh nhỏ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
