"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { AdminFormDialog } from "@/components/admin/shared/admin-form-dialog";
import { AdminOutlineButton } from "@/components/admin/shared/admin-outline-button";
import { AdminSelect } from "@/components/admin/shared/admin-select";
import { Input } from "@/components/site/shared/ui/input/input";
import { Textarea } from "@/components/site/shared/ui/textarea/textarea";
import type { YoutubeMetadata } from "@/lib/videos/youtube-metadata";
import type {
  WorshipVideoCategory,
  WorshipVideoItem,
  WorshipVideoSource,
} from "@/lib/videos/admin-worship-store";
import { parseYoutubeInput } from "@/lib/videos/admin-worship-store";
import { cn } from "@/lib/utils";
import { AdminDateInput } from "../shared/admin-datetime-input";

export type WorshipVideoFormValues = {
  categoryId: string;
  title: string;
  sourceType: WorshipVideoSource;
  youtubeUrl: string;
  uploadUrl: string;
  publishedAt: string;
  duration: string;
  speaker: string;
  description: string;
};

type AdminWorshipVideoModalProps = {
  open: boolean;
  categories: WorshipVideoCategory[];
  defaultValues: WorshipVideoFormValues;
  editingId: string | null;
  onClose: () => void;
  onSubmit: (values: WorshipVideoFormValues) => void;
  onUploadVideo: (file: File) => Promise<string>;
};

const SOURCE_OPTIONS = [
  { value: "youtube", label: "YouTube" },
  { value: "upload", label: "Tải video lên" },
] as const;

function formatVideoDuration(totalSeconds: number): string {
  const seconds = Math.floor(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

async function readUploadVideoDuration(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration)
        ? formatVideoDuration(video.duration)
        : "";
      URL.revokeObjectURL(objectUrl);
      resolve(duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Không đọc được thời lượng video."));
    };
    video.src = objectUrl;
  });
}

export function AdminWorshipVideoModal({
  open,
  categories,
  defaultValues,
  editingId,
  onClose,
  onSubmit,
  onUploadVideo,
}: AdminWorshipVideoModalProps) {
  const form = useForm<WorshipVideoFormValues>({ defaultValues });
  const sourceType = useWatch({ control: form.control, name: "sourceType" });
  const youtubeUrl = useWatch({ control: form.control, name: "youtubeUrl" });
  const uploadUrl = useWatch({ control: form.control, name: "uploadUrl" });
  const [isFetchingYoutube, setIsFetchingYoutube] = useState(false);
  const [youtubeFetchError, setYoutubeFetchError] = useState<string | null>(null);
  const lastFetchedYoutubeId = useRef("");

  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      lastFetchedYoutubeId.current = "";
      setYoutubeFetchError(null);
      setIsFetchingYoutube(false);
    }
  }, [defaultValues, form, open]);

  useEffect(() => {
    if (!open || sourceType !== "youtube") return;

    const { youtubeId } = parseYoutubeInput(youtubeUrl ?? "");
    if (!youtubeId || youtubeId.length !== 11) {
      setYoutubeFetchError(null);
      return;
    }

    if (youtubeId === lastFetchedYoutubeId.current) return;

    const timer = window.setTimeout(async () => {
      setIsFetchingYoutube(true);
      setYoutubeFetchError(null);

      try {
        const response = await fetch(
          `/api/youtube/metadata?videoId=${encodeURIComponent(youtubeId)}`,
        );

        if (!response.ok) {
          throw new Error("Không lấy được thông tin video từ YouTube.");
        }

        const metadata = (await response.json()) as YoutubeMetadata;
        lastFetchedYoutubeId.current = youtubeId;

        if (metadata.title) {
          form.setValue("title", metadata.title);
        }
        if (metadata.publishedAt) {
          form.setValue("publishedAt", metadata.publishedAt);
        }
        if (metadata.duration) {
          form.setValue("duration", metadata.duration);
        }
        if (metadata.authorName) {
          form.setValue("speaker", metadata.authorName);
        }
      } catch {
        setYoutubeFetchError(
          "Không tự lấy được metadata. Bạn vẫn có thể nhập tay các trường bên dưới.",
        );
      } finally {
        setIsFetchingYoutube(false);
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [form, open, sourceType, youtubeUrl]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await onUploadVideo(file);
    form.setValue("uploadUrl", url);

    if (!form.getValues("title")) {
      form.setValue("title", file.name.replace(/\.[^.]+$/, ""));
    }

    try {
      const duration = await readUploadVideoDuration(file);
      if (duration) {
        form.setValue("duration", duration);
      }
    } catch {
      // Giữ trống để admin nhập tay nếu trình duyệt không đọc được metadata.
    }
  }

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      title={editingId ? "Chỉnh sửa video" : "Thêm video mới"}
      className="sm:max-w-3xl"
      footer={
        <div className="flex justify-end gap-2">
          <AdminOutlineButton type="button" onClick={onClose}>
            Hủy
          </AdminOutlineButton>
          <AdminOutlineButton
            type="submit"
            form="admin-worship-video-form"
            className="border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {editingId ? "Cập nhật" : "Thêm video"}
          </AdminOutlineButton>
        </div>
      }
    >
      <form
        id="admin-worship-video-form"
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-card-foreground">Danh mục</span>
          <AdminSelect
            value={form.watch("categoryId")}
            onChange={(value) => form.setValue("categoryId", value)}
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            placeholder="Chọn danh mục"
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-2">
          {SOURCE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-[12px] border px-4 py-3 transition-colors",
                sourceType === option.value
                  ? "border-accent bg-accent/5"
                  : "border-border bg-background",
              )}
            >
              <input
                type="radio"
                value={option.value}
                checked={sourceType === option.value}
                onChange={() => form.setValue("sourceType", option.value)}
                className="size-4 accent-[var(--accent)]"
              />
              <span className="text-sm font-medium text-card-foreground">
                {option.label}
              </span>
            </label>
          ))}
        </div>

        {sourceType === "youtube" ? (
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-card-foreground">
              Link YouTube
            </span>
            <Input
              {...form.register("youtubeUrl")}
              placeholder="https://www.youtube.com/watch?v=..."
              className="rounded-[10px]"
            />
            {isFetchingYoutube ? (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                Đang lấy tiêu đề, ngày đăng và thời lượng từ YouTube...
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Sau khi dán link, hệ thống tự điền tiêu đề, ngày đăng, thời lượng và
                kênh đăng. Mô tả cần nhập tay (YouTube không trả về qua API hiện tại).
              </p>
            )}
            {youtubeFetchError ? (
              <p className="text-xs text-destructive">{youtubeFetchError}</p>
            ) : null}
          </label>
        ) : (
          <div className="space-y-3 rounded-[12px] border border-dashed border-border bg-muted/20 p-4">
            <p className="text-sm font-medium text-card-foreground">Tải file video</p>
            <Input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-[8px] file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
            />
            {uploadUrl ? (
              <p className="text-xs text-muted-foreground">
                Đã chọn file. Tiêu đề lấy từ tên file, thời lượng đọc từ metadata video
                (nếu trình duyệt hỗ trợ).
              </p>
            ) : null}
          </div>
        )}

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-card-foreground">Tiêu đề video</span>
          <Input
            {...form.register("title", { required: true })}
            placeholder="Nhập tiêu đề hiển thị"
            className="rounded-[10px]"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-card-foreground">Ngày đăng</span>
            <AdminDateInput {...form.register("publishedAt")} />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-card-foreground">Thời lượng</span>
            <Input
              {...form.register("duration")}
              placeholder="1:05:12"
              className="rounded-[10px]"
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-card-foreground">
            Người đăng / Diễn giả
          </span>
          <Input
            {...form.register("speaker")}
            placeholder="Ví dụ: Cha Chánh xứ"
            className="rounded-[10px]"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-card-foreground">Mô tả</span>
          <Textarea
            {...form.register("description")}
            placeholder="Mô tả ngắn về video..."
            className="min-h-[88px] rounded-[10px]"
          />
        </label>
      </form>
    </AdminFormDialog>
  );
}

export function mapVideoToFormValues(video: WorshipVideoItem): WorshipVideoFormValues {
  return {
    categoryId: video.categoryId,
    title: video.title,
    sourceType: video.sourceType,
    youtubeUrl: video.youtubeUrl ?? "",
    uploadUrl: video.uploadUrl ?? "",
    publishedAt: video.publishedAt,
    duration: video.duration ?? "",
    speaker: video.speaker ?? "",
    description: video.description ?? "",
  };
}

export function mapFormValuesToVideo(
  values: WorshipVideoFormValues,
  editingId: string | null,
): WorshipVideoItem {
  const { youtubeId, youtubeUrl } =
    values.sourceType === "youtube"
      ? parseYoutubeInput(values.youtubeUrl)
      : { youtubeId: "", youtubeUrl: "" };

  return {
    id: editingId ?? `vid-${crypto.randomUUID()}`,
    categoryId: values.categoryId,
    title: values.title.trim(),
    sourceType: values.sourceType,
    youtubeId: youtubeId || undefined,
    youtubeUrl: youtubeUrl || undefined,
    uploadUrl: values.sourceType === "upload" ? values.uploadUrl : undefined,
    thumbnail: youtubeId
      ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
      : undefined,
    duration: values.duration,
    publishedAt: values.publishedAt,
    description: values.description,
    speaker: values.speaker,
  };
}
