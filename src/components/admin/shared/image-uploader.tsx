"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn, resolveApiUrl } from "@/lib/utils";
import Image from "next/image";
import { Input } from "@/components/site/shared/ui/input/input";

type ImageUploaderProps = {
  value?: string | null;
  onChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string>;
  className?: string;
};

export function ImageUploader({
  value,
  onChange,
  onUpload,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await onUpload(file);
      setPreview(url);
      onChange(url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    setPreview(null);
    onChange(null);
  }

  return (
    <div className={cn("w-full max-w-sm", className)}>
      {preview ? (
        <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30 p-3">
          <Image
            src={resolveApiUrl(preview)}
            alt="Cover preview"
            className="h-full w-auto max-w-full object-contain"
            width={480}
            height={224}
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove image"
            className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-56 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-card px-3 transition-colors hover:border-accent hover:bg-accent/5 disabled:opacity-50"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1.5">
              <div className="size-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <span className="text-xs text-muted-foreground">Đang tải...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Nhấp để tải ảnh
              </span>
              <span className="text-[11px] text-muted-foreground/80">
                JPEG, PNG, WebP · tối đa 5MB
              </span>
            </div>
          )}
        </button>
      )}
      <Input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}