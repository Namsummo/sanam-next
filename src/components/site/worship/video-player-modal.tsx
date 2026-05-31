"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Video } from "@/lib/videos/types";

type VideoPlayerModalProps = {
  video: Video | null;
  onClose: () => void;
};

export function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  useEffect(() => {
    if (video) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [video]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <div
        className="fixed inset-0 bg-[#010101]/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[960px] overflow-hidden rounded-2xl bg-black shadow-[0_35px_70px_rgba(0,0,0,0.35)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-accent transition-colors"
          aria-label="Đóng"
        >
          <X className="size-5" />
        </button>

        <div className="relative w-full aspect-video">
          <iframe
            title={video.title}
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
