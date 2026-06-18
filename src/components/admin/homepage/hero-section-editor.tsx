/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import { getToken } from "@/lib/admin/mock-auth";
import {
  getHeroSettings,
  updateHeroSettings,
  uploadHeroFile,
  DEFAULT_HERO_SETTINGS,
  type HeroSettingsData,
  type HeroButtonData,
  type HeroCounterData,
} from "@/shared/services/hero-settings-api";

type HeroZone =
  | "background"
  | "subtitle"
  | "title"
  | "description"
  | "primaryButton"
  | "secondaryButton"
  | { type: "counter"; index: number };

function heroZoneLabel(zone: HeroZone): string {
  if (typeof zone === "string") {
    const labels: Record<string, string> = {
      background: "Nền (Video / Ảnh)",
      subtitle: "Phụ đề",
      title: "Tiêu đề",
      description: "Mô tả",
      primaryButton: "Nút chính",
      secondaryButton: "Nút phụ",
    };
    return labels[zone] ?? zone;
  }
  return `Thống kê #${zone.index + 1}`;
}

export function HeroSectionEditor() {
  const [settings, setSettings] = useState<HeroSettingsData>(DEFAULT_HERO_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"video" | "image" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<HeroZone | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHeroSettings();
      setSettings(data);
    } catch {
      setSettings(DEFAULT_HERO_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function handleFieldChange(field: string, value: string | number | HeroButtonData | HeroCounterData[]) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  function handleButtonFieldChange(btnKey: "primaryButton" | "secondaryButton", field: "text" | "link", value: string) {
    setSettings((prev) => ({ ...prev, [btnKey]: { ...prev[btnKey], [field]: value } }));
  }

  function handleCounterChange(index: number, field: "value" | "label", value: string | number) {
    setSettings((prev) => {
      const counters = [...prev.counters];
      counters[index] = { ...counters[index], [field]: value };
      return { ...prev, counters };
    });
  }

  function handleVisibilityToggle(field: keyof typeof settings.visibility) {
    setSettings((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, [field]: !prev.visibility[field] },
    }));
  }

  function handleUpdateBackgroundVideo(value: string) {
    setSettings((prev) => ({ ...prev, backgroundVideoUrl: value }));
  }

  function handleUpdateBackgroundImage(value: string) {
    setSettings((prev) => ({ ...prev, backgroundImageUrl: value }));
  }

  async function handleSave() {
    const token = getToken();
    if (!token) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await updateHeroSettings(token, settings);
      setSettings(updated);
      setSelectedZone(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(target: "video" | "image") {
    const token = getToken();
    if (!token) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = target === "video" ? "video/mp4,video/webm,video/ogg" : "image/jpeg,image/png,image/gif,image/webp";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        setUploading(target);
        setError(null);
        const url = await uploadHeroFile(token, file);
        if (target === "video") handleUpdateBackgroundVideo(url);
        else handleUpdateBackgroundImage(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(null);
      }
    };
    input.click();
  }

  function removeCounter(index: number) {
    setSettings((prev) => ({ ...prev, counters: prev.counters.filter((_, i) => i !== index) }));
    if (selectedZone && typeof selectedZone !== "string" && selectedZone.type === "counter" && selectedZone.index === index) {
      setSelectedZone(null);
    }
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
        <h3 className="font-display text-lg font-semibold text-card-foreground">{heroZoneLabel(selectedZone)}</h3>

        {zoneType === "background" && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Video nền</label>
              <div className="flex gap-2">
                <input type="text" value={settings.backgroundVideoUrl} onChange={(e) => handleUpdateBackgroundVideo(e.target.value)}
                  className="min-w-0 flex-1 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" placeholder="https://example.com/video.mp4" />
                <button type="button" onClick={() => handleUpload("video")} disabled={uploading === "video"}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">
                  {uploading === "video" ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Tải lên
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Ảnh nền (dự phòng)</label>
              <div className="flex gap-2">
                <input type="text" value={settings.backgroundImageUrl} onChange={(e) => handleUpdateBackgroundImage(e.target.value)}
                  className="min-w-0 flex-1 rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" placeholder="https://example.com/bg.jpg" />
                <button type="button" onClick={() => handleUpload("image")} disabled={uploading === "image"}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 py-2 text-sm text-card-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">
                  {uploading === "image" ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Tải lên
                </button>
              </div>
            </div>
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
            <input type="text" value={settings.subtitle} onChange={(e) => handleFieldChange("subtitle", e.target.value)}
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
            <textarea rows={3} value={settings.title} onChange={(e) => handleFieldChange("title", e.target.value)}
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
            <textarea rows={4} value={settings.description} onChange={(e) => handleFieldChange("description", e.target.value)}
              className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        )}

        {(zoneType === "primaryButton" || zoneType === "secondaryButton") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-[10px] border border-border bg-muted/50 px-3 py-2">
              <span className="text-sm font-medium text-card-foreground">Hiển thị {zoneType === "primaryButton" ? "Nút chính" : "Nút phụ"}</span>
              <button type="button" onClick={() => handleVisibilityToggle(zoneType === "primaryButton" ? "primaryButton" : "secondaryButton")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility[zoneType === "primaryButton" ? "primaryButton" : "secondaryButton"] ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Nội dung nút</label>
              <input type="text"
                value={zoneType === "primaryButton" ? settings.primaryButton.text : settings.secondaryButton.text}
                onChange={(e) => handleButtonFieldChange(zoneType === "primaryButton" ? "primaryButton" : "secondaryButton", "text", e.target.value)}
                className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Đường dẫn (link)</label>
              <input type="text"
                value={zoneType === "primaryButton" ? settings.primaryButton.link : settings.secondaryButton.link}
                onChange={(e) => handleButtonFieldChange(zoneType === "primaryButton" ? "primaryButton" : "secondaryButton", "link", e.target.value)}
                className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="/contact" />
            </div>
          </div>
        )}

        {zoneType === "counter" && typeof selectedZone !== "string" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-[10px] border border-border bg-muted/50 px-3 py-2">
              <span className="text-sm font-medium text-card-foreground">Hiển thị toàn bộ thống kê</span>
              <button type="button" onClick={() => handleVisibilityToggle("counters")} className="text-muted-foreground hover:text-foreground">
                {settings.visibility.counters ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Giá trị</label>
              <input type="number" value={settings.counters[selectedZone.index]?.value ?? 0}
                onChange={(e) => handleCounterChange(selectedZone.index, "value", Number(e.target.value))}
                className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Nhãn</label>
              <input type="text" value={settings.counters[selectedZone.index]?.label ?? ""}
                onChange={(e) => handleCounterChange(selectedZone.index, "label", e.target.value)}
                className="w-full rounded-[10px] border border-border bg-background px-3 py-2 text-sm text-card-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent" />
            </div>
            <button type="button" onClick={() => removeCounter(selectedZone.index)}
              className="inline-flex items-center gap-1.5 text-sm text-destructive transition-colors hover:text-destructive/80">
              <Trash2 className="size-3.5" /> Xóa thống kê này
            </button>
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
              <HeroPreview settings={settings} selectedZone={selectedZone} onSelectZone={setSelectedZone} />
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[380px] shrink-0">
          <div className="sticky top-6 rounded-[20px] border border-border bg-card p-5">
            <div className="mb-5 border-b border-border pb-4">
              <h2 className="font-display text-base font-semibold text-card-foreground">Chỉnh sửa</h2>
              {selectedZone && <p className="mt-0.5 text-xs text-muted-foreground">Đang chỉnh sửa: {heroZoneLabel(selectedZone)}</p>}
            </div>
            <div className="min-h-[200px]">{renderEditPanel()}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function HeroPreview({ settings, selectedZone, onSelectZone }: {
  settings: HeroSettingsData;
  selectedZone: HeroZone | null;
  onSelectZone: (zone: HeroZone) => void;
}) {
  return (
    <div className={`hero dark-section !min-h-0 !h-auto !p-[205px_0_80px] !m-0 !rounded-none transition-all ${selectedZone === "background" ? "ring-2 ring-accent" : ""}`}>
      <div className="hero-bg-video">
        <video autoPlay muted playsInline loop preload="metadata">
          <source src={settings.backgroundVideoUrl} type="video/mp4" />
        </video>
      </div>

      <button type="button" onClick={() => onSelectZone("background")}
        className={`absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-[10px] border border-white/30 bg-black/50 px-2.5 py-1.5 text-xs text-white/80 backdrop-blur-sm transition-all hover:bg-black/70 hover:text-white ${selectedZone === "background" ? "ring-2 ring-accent" : ""}`}>
        <ImageIcon className="size-3.5" /> Nền
      </button>

      <div className="container mx-auto max-w-[1300px] px-4">
        <div className="flex flex-wrap items-end -mx-4">
          <div className="w-full xl:w-1/2 px-4">
            <div className="hero-content">
              <div className="section-title">
                <button type="button" onClick={() => onSelectZone("subtitle")}
                  className={`section-sub-title !cursor-pointer text-left transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "subtitle" ? "ring-2 ring-accent" : ""} ${!settings.visibility.subtitle ? "opacity-40" : ""}`}>
                  {settings.subtitle} <Pencil className="ml-2 inline-block size-3 opacity-60" />
                </button>
                <button type="button" onClick={() => onSelectZone("title")}
                  className={`block w-full text-left font-display font-semibold uppercase leading-none text-white transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "title" ? "ring-2 ring-accent" : ""} ${!settings.visibility.title ? "opacity-40" : ""}`}
                  style={{ fontSize: "65px", cursor: "pointer" }}>
                  {settings.title} <Pencil className="ml-2 inline-block size-4 opacity-60" />
                </button>
              </div>
              <div className="hero-content-btn !mt-5">
                <button type="button" onClick={() => onSelectZone("primaryButton")}
                  className={`btn-default btn-highlighted transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "primaryButton" ? "ring-2 ring-accent" : ""} ${!settings.visibility.primaryButton ? "opacity-40" : ""}`}>
                  {settings.primaryButton.text} <Pencil className="ml-2 inline-block size-3 opacity-60" />
                </button>
                <button type="button" onClick={() => onSelectZone("secondaryButton")}
                  className={`btn-default btn-border transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "secondaryButton" ? "ring-2 ring-accent" : ""} ${!settings.visibility.secondaryButton ? "opacity-40" : ""}`}>
                  {settings.secondaryButton.text} <Pencil className="ml-2 inline-block size-3 opacity-60" />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-1/2 px-4">
            <div className="hero-body !ml-0 xl:!ml-[50px]">
              <div className="hero-body-content">
                <button type="button" onClick={() => onSelectZone("description")}
                  className={`w-full text-left font-sans text-base font-semibold leading-relaxed text-white transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone === "description" ? "ring-2 ring-accent" : ""} ${!settings.visibility.description ? "opacity-40" : ""}`}>
                  {settings.description} <Pencil className="ml-2 inline-block size-3 opacity-60" />
                </button>
              </div>
              <div className={`hero-counter-list ${!settings.visibility.counters ? "opacity-40" : ""}`}>
                {settings.counters.map((counter, index) => (
                  <button key={index} type="button" onClick={() => onSelectZone({ type: "counter", index })}
                    className={`hero-counter-item !w-[calc(33.33%-40px)] text-center transition-all hover:ring-2 hover:ring-accent/50 ${selectedZone && typeof selectedZone !== "string" && selectedZone.type === "counter" && selectedZone.index === index ? "ring-2 ring-accent" : ""}`}>
                    <h2 className="font-display text-[40px] font-semibold uppercase leading-none text-white"><span>{counter.value}</span>+</h2>
                    <p className="font-sans text-sm text-white mt-1">{counter.label} <Pencil className="ml-2 inline-block size-3 opacity-60" /></p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
