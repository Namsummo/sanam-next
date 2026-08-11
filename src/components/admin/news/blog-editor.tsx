"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { cn } from "@/lib/utils";

type BlogEditorProps = {
  content: string;
  onChange: (html: string) => void;
  className?: string;
};

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

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
      toolbar: TOOLBAR_OPTIONS,
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
    </div>
  );
}
