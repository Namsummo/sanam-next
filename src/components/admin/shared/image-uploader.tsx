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
    <div className={cn("", className)}>
      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <Image
            src={resolveApiUrl(preview)}
            alt="Cover preview"
            className="size-full object-cover"
            width={500}
            height={500}
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove image"
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-2/1 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card transition-colors hover:border-accent hover:bg-accent/5 disabled:opacity-50"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="size-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <span className="text-sm text-muted-foreground">Đang tải...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="size-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Nhấp để tải ảnh bìa
              </span>
              <span className="text-xs text-muted-foreground">
                JPEG, PNG, WebP tối đa 5MB
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
