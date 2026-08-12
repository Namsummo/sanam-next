"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { cn } from "@/lib/utils";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

type BlogEditorProps = {
  content: string;
  onChange: (html: string) => void;
  className?: string;
};

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type ImageHandlerContext = {
  quill: {
    getLength: () => number;
    getSelection: (focus?: boolean) => { index: number } | null;
    insertEmbed: (index: number, type: string, value: string, source?: string) => void;
    setSelection: (index: number, length: number, source?: string) => void;
  };
};

function handleImage(this: ImageHandlerContext) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/jpeg,image/png,image/webp,image/gif";

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      window.alert(`Ảnh không được vượt quá ${MAX_IMAGE_SIZE_MB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      const range = this.quill.getSelection(true);
      const index = range?.index ?? this.quill.getLength();
      this.quill.insertEmbed(index, "image", reader.result, "user");
      this.quill.setSelection(index + 1, 0, "silent");
    };
    reader.readAsDataURL(file);
  };

  input.click();
}

const TOOLBAR_OPTIONS = [
  [{ header: [2, 3, 4, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  [{ align: [] }],
  ["link", "image"],
  ["clean"],
];

export function BlogEditor({ content, onChange, className }: BlogEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: TOOLBAR_OPTIONS,
        handlers: {
          image: handleImage,
        },
      },
    }),
    [],
  );

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border", className)}>
      <ReactQuill
        value={content}
        onChange={onChange}
        modules={modules}
        placeholder="Viết nội dung bài viết..."
        theme="snow"
        className="min-h-[400px]"
      />
      <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        Ảnh trong nội dung: JPG, PNG, WebP hoặc GIF, tối đa {MAX_IMAGE_SIZE_MB} MB mỗi ảnh.
      </p>
    </div>
  );
}
