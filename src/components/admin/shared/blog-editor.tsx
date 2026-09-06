"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ImagePlus, Trash2 } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import { cn } from "@/lib/utils";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

type BlogEditorProps = {
  content: string;
  onChange: (html: string) => void;
  className?: string;
};

type QuillLike = {
  root: HTMLElement;
  focus: () => void;
  getLength: () => number;
  getIndex: (blot: unknown) => number;
  getSelection: (focus?: boolean) => { index: number; length: number } | null;
  setSelection: (index: number, length?: number, source?: string) => void;
  insertEmbed: (index: number, type: string, value: string, source?: string) => void;
  deleteText: (index: number, length: number, source?: string) => void;
};

type QuillStatic = {
  find: (node: Node | null, bubble?: boolean) => unknown;
};

type HandlerContext = {
  quill: QuillLike;
};

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const TOOLBAR_OPTIONS = [
  [{ header: [2, 3, 4, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"],
];

function pickImageFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif";
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.oncancel = () => resolve(null);
    input.click();
  });
}

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      reject(new Error(`Ảnh không được vượt quá ${MAX_IMAGE_SIZE_MB} MB.`));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Không đọc được ảnh."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("Không đọc được ảnh."));
    reader.readAsDataURL(file);
  });
}

/** Chuyển URL YouTube (watch / youtu.be / shorts / embed) → embed URL */
function toYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url.trim());

    // youtu.be/VIDEO_ID
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (u.hostname.includes("youtube.com")) {
      // youtube.com/watch?v=VIDEO_ID
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      // youtube.com/embed/VIDEO_ID (đã là embed)
      if (u.pathname.startsWith("/embed/")) {
        return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
      }

      // youtube.com/shorts/VIDEO_ID
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

function handleImage(this: HandlerContext) {
  void (async () => {
    const file = await pickImageFile();
    if (!file) return;

    try {
      const dataUrl = await readImageFile(file);
      const range = this.quill.getSelection(true);
      const index = range?.index ?? this.quill.getLength();
      this.quill.insertEmbed(index, "image", dataUrl, "user");
      this.quill.setSelection(index + 1, 0, "silent");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Không thêm được ảnh.");
    }
  })();
}

function handleVideo(this: HandlerContext) {
  const url = window.prompt("Dán link YouTube (hoặc link embed):");
  if (!url?.trim()) return;

  const embedUrl = toYouTubeEmbedUrl(url) ?? url.trim();

  const range = this.quill.getSelection(true);
  const index = range?.index ?? this.quill.getLength();
  this.quill.insertEmbed(index, "video", embedUrl, "user");
  this.quill.setSelection(index + 1, 0, "silent");
}

export function BlogEditor({ content, onChange, className }: BlogEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const quillStaticRef = useRef<QuillStatic | null>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: TOOLBAR_OPTIONS,
        handlers: {
          image: handleImage,
          video: handleVideo,
        },
      },
    }),
    [],
  );

  const getQuill = useCallback((): QuillLike | null => {
    const container = wrapperRef.current?.querySelector(".ql-container");
    const Quill = quillStaticRef.current;
    if (!container || !Quill) return null;

    const instance = Quill.find(container);
    if (!instance || typeof instance !== "object" || !("root" in instance)) return null;
    return instance as QuillLike;
  }, []);

  const findBlot = useCallback((node: Node) => {
    return quillStaticRef.current?.find(node) ?? null;
  }, []);

  const clearImageSelection = useCallback(() => {
    setSelectedImage((prev) => {
      prev?.classList.remove("ql-image-selected");
      return null;
    });
    setToolbarPos(null);
  }, []);

  const positionToolbar = useCallback((img: HTMLImageElement) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    setToolbarPos({
      top: imgRect.top - wrapperRect.top + wrapper.scrollTop + 8,
      left: Math.min(
        Math.max(imgRect.left - wrapperRect.left + wrapper.scrollLeft + 8, 8),
        Math.max(wrapperRect.width - 160, 8),
      ),
    });
  }, []);

  const selectImage = useCallback(
    (img: HTMLImageElement) => {
      const quill = getQuill();
      if (!quill) return;

      wrapperRef.current
        ?.querySelectorAll("img.ql-image-selected")
        .forEach((el) => el.classList.remove("ql-image-selected"));

      img.classList.add("ql-image-selected");
      setSelectedImage(img);
      positionToolbar(img);

      const blot = findBlot(img);
      if (!blot) return;

      const index = quill.getIndex(blot);
      quill.focus();
      quill.setSelection(index, 1, "silent");
    },
    [findBlot, getQuill, positionToolbar],
  );

  const deleteSelectedImage = useCallback(() => {
    const quill = getQuill();
    const img = selectedImage;
    if (!quill || !img) return;

    const blot = findBlot(img);
    if (!blot) return;

    const index = quill.getIndex(blot);
    quill.deleteText(index, 1, "user");
    clearImageSelection();
    quill.focus();
    quill.setSelection(index, 0, "silent");
  }, [clearImageSelection, findBlot, getQuill, selectedImage]);

  const replaceSelectedImage = useCallback(() => {
    void (async () => {
      const quill = getQuill();
      const img = selectedImage;
      if (!quill || !img) return;

      const file = await pickImageFile();
      if (!file) return;

      try {
        const dataUrl = await readImageFile(file);
        const blot = findBlot(img);
        if (!blot) return;

        const index = quill.getIndex(blot);
        quill.deleteText(index, 1, "user");
        quill.insertEmbed(index, "image", dataUrl, "user");
        quill.setSelection(index + 1, 0, "silent");

        requestAnimationFrame(() => {
          const replaced =
            Array.from(quill.root.querySelectorAll("img")).find(
              (el) => el.getAttribute("src") === dataUrl,
            ) ?? null;

          if (replaced) selectImage(replaced);
          else clearImageSelection();
        });
      } catch (err) {
        window.alert(err instanceof Error ? err.message : "Không đổi được ảnh.");
      }
    })();
  }, [clearImageSelection, findBlot, getQuill, selectImage, selectedImage]);

  useEffect(() => {
    let cancelled = false;

    void import("react-quill-new").then((mod) => {
      if (!cancelled) {
        quillStaticRef.current = mod.Quill as unknown as QuillStatic;
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const img = target.closest("img");
      if (img && wrapper?.contains(img) && img.closest(".ql-editor")) {
        event.preventDefault();
        selectImage(img as HTMLImageElement);
        return;
      }

      if (!target.closest("[data-image-toolbar]")) {
        clearImageSelection();
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!selectedImage) return;
      if (event.key !== "Backspace" && event.key !== "Delete") return;

      const selection = getQuill()?.getSelection();
      if (selection?.length === 1) {
        event.preventDefault();
        deleteSelectedImage();
      }
    }

    function onScrollOrResize() {
      if (selectedImage) positionToolbar(selectedImage);
    }

    wrapper.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onScrollOrResize);
    wrapper.addEventListener("scroll", onScrollOrResize, true);

    return () => {
      wrapper.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onScrollOrResize);
      wrapper.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [
    clearImageSelection,
    deleteSelectedImage,
    getQuill,
    positionToolbar,
    selectImage,
    selectedImage,
  ]);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative overflow-hidden rounded-2xl border border-border", className)}
    >
      <ReactQuill
        value={content}
        onChange={onChange}
        modules={modules}
        useSemanticHTML={false}
        placeholder="Viết nội dung bài viết..."
        theme="snow"
        className="min-h-100"
      />

      {selectedImage && toolbarPos ? (
        <div
          data-image-toolbar
          className="absolute z-20 flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-md"
          style={{ top: toolbarPos.top, left: toolbarPos.left }}
        >
          <button
            type="button"
            onClick={replaceSelectedImage}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-card-foreground transition-colors hover:bg-muted"
            title="Đổi ảnh"
          >
            <ImagePlus className="size-3.5" />
            Đổi ảnh
          </button>
          <button
            type="button"
            onClick={deleteSelectedImage}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
            title="Xóa ảnh"
          >
            <Trash2 className="size-3.5" />
            Xóa
          </button>
        </div>
      ) : null}

      <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        Ảnh: JPG, PNG, WebP hoặc GIF, tối đa {MAX_IMAGE_SIZE_MB} MB. Click vào ảnh để đổi/xóa.
        Video: nút video → dán link YouTube (watch, youtu.be, shorts) để nhúng player.
      </p>
    </div>
  );
}