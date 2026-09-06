"use client";

import { useRef, useState } from "react";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import { resolveApiUrl } from "@/lib/utils";

type MemberImageUploaderProps = {
  value?: string | null;
  onChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string>;
};

export function MemberImageUploader({
  value,
  onChange,
  onUpload,
}: MemberImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange(null);
  }

  return (
    <div className="relative size-11 shrink-0">
      {value ? (
        <div className="group relative size-full overflow-hidden rounded-lg border border-border bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveApiUrl(value)}
            alt="Member"
            className="size-full object-contain"
          />
          <button
            type="button"
            onClick={handleRemove}
            title="Xóa ảnh"
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="size-3.5 text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex size-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 transition-colors hover:border-accent hover:bg-accent/5 disabled:opacity-50"
          title="Tải ảnh lên"
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <ImageIcon className="size-4 text-muted-foreground" />
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        aria-label="Tải ảnh thành viên"
        onChange={handleFile}
      />
    </div>
  );
}
