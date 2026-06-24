"use client";

import Link from "next/link";
import { ExternalLink, Radio, Save } from "lucide-react";
import type { LiveSettings } from "@/lib/videos/types";
import { parseYoutubeInput } from "@/lib/videos/admin-worship-store";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { Input } from "@/components/site/shared/ui/input/input";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";
import { cn } from "@/lib/utils";

type AdminWorshipLivePanelProps = {
  live: LiveSettings;
  onChange: (live: LiveSettings) => void;
  onSave: () => void;
  isSaving?: boolean;
};

export function AdminWorshipLivePanel({
  live,
  onChange,
  onSave,
  isSaving = false,
}: AdminWorshipLivePanelProps) {
  const hasValidYoutube = live.youtubeId.length === 11;

  function handleUrlChange(value: string) {
    const { youtubeId, youtubeUrl } = parseYoutubeInput(value);
    onChange({
      ...live,
      youtubeUrl: youtubeUrl || value,
      youtubeId,
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-border bg-card p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="size-5 text-accent" aria-hidden />
              <h2 className="font-display text-xl font-semibold text-card-foreground">
                Phát trực tiếp
              </h2>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Dán link YouTube livestream và bật phát trực tiếp. Trang web sẽ hiển thị
              player tại{" "}
              <Link
                href="/worship/live"
                target="_blank"
                className="font-medium text-accent hover:underline"
              >
                /worship/live
              </Link>
              .
            </p>
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              live.isLive && hasValidYoutube
                ? "bg-accent/15 text-accent"
                : "bg-muted text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                live.isLive && hasValidYoutube ? "animate-pulse bg-accent" : "bg-muted-foreground/50",
              )}
            />
            {live.isLive && hasValidYoutube ? "Đang phát" : "Chưa phát"}
          </span>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-card-foreground">
                Link YouTube livestream
              </span>
              <Input
                value={live.youtubeUrl}
                onChange={(event) => handleUrlChange(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="rounded-[10px]"
              />
              <span className="text-xs text-muted-foreground">
                Hỗ trợ link dạng watch, youtu.be hoặc mã video 11 ký tự.
              </span>
            </label>

            {live.youtubeId ? (
              <div className="rounded-[10px] border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                Mã video:{" "}
                <code className="font-mono text-card-foreground">{live.youtubeId}</code>
              </div>
            ) : null}

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-card-foreground">
                Tiêu đề hiển thị (tuỳ chọn)
              </span>
              <Input
                value={live.title ?? ""}
                onChange={(event) =>
                  onChange({ ...live, title: event.target.value })
                }
                placeholder="Ví dụ: Thánh lễ Chúa Nhật trực tuyến"
                className="rounded-[10px]"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-card-foreground">
                Mô tả ngắn (tuỳ chọn)
              </span>
              <Textarea
                value={live.description ?? ""}
                onChange={(event) =>
                  onChange({ ...live, description: event.target.value })
                }
                placeholder="Thông tin thêm cho buổi phát trực tiếp..."
                className="min-h-[96px] rounded-[10px]"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-border bg-background px-4 py-3">
              <input
                type="checkbox"
                checked={live.isLive}
                onChange={(event) =>
                  onChange({ ...live, isLive: event.target.checked })
                }
                className="size-4 accent-[var(--accent)]"
              />
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  Bật phát trực tiếp trên website
                </p>
                <p className="text-xs text-muted-foreground">
                  Tắt khi buổi livestream kết thúc.
                </p>
              </div>
            </label>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-card-foreground">Xem trước</p>
            <div className="overflow-hidden rounded-[14px] border border-border bg-black">
              {hasValidYoutube ? (
                <div className="aspect-video">
                  <iframe
                    title="Livestream preview"
                    src={`https://www.youtube.com/embed/${live.youtubeId}?rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </div>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center gap-2 px-6 text-center text-sm text-white/60">
                  <Radio className="size-10 text-white/25" />
                  <p>Nhập link YouTube hợp lệ để xem trước.</p>
                </div>
              )}
            </div>

            {live.isLive && !hasValidYoutube ? (
              <p className="text-sm text-destructive">
                Cần link YouTube hợp lệ trước khi bật phát trực tiếp.
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-5">
          <Link
            href="/worship/live"
            target="_blank"
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border bg-card px-3 text-sm text-card-foreground transition-colors hover:bg-muted"
          >
            <ExternalLink className="size-4" aria-hidden />
            Mở trang live
          </Link>
          <AdminOutlineButton
            type="button"
            onClick={onSave}
            disabled={isSaving || (live.isLive && !hasValidYoutube)}
            className="border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="size-4" aria-hidden />
            {isSaving ? "Đang lưu..." : "Lưu cấu hình live"}
          </AdminOutlineButton>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Giai đoạn mock: cấu hình được lưu vào trình duyệt (localStorage). Khi có API,
        phần này sẽ đồng bộ với server.
      </p>
    </div>
  );
}
