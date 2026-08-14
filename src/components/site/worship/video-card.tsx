import Image from "next/image";
import { Play, Clock, Eye, User } from "lucide-react";
import { Video } from "@/lib/videos/types";
import { cn, resolveApiUrl } from "@/lib/utils";

interface VideoCardProps {
  video: Video;
  isActive: boolean;
  onSelect: (video: Video) => void;
}

export function VideoCard({ video, isActive, onSelect }: VideoCardProps) {
  return (
    <button
      onClick={() => onSelect(video)}
      className={cn(
        "group flex flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl overflow-hidden transition-all duration-300 w-full bg-card border border-border/50 hover:border-accent/40",
        isActive ? "ring-2 ring-accent border-accent/50" : ""
      )}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/10">
        <Image
          src={resolveApiUrl(video.thumbnail)}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay with Play button */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="size-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="size-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Video Duration Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/75 px-2 py-0.5 rounded text-[11px] font-medium text-white flex items-center gap-1">
          <Clock className="size-3" />
          {video.duration}
        </div>

        {/* Active playing indicator */}
        {isActive && (
          <div className="absolute top-2.5 left-2.5 bg-accent px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-white flex items-center gap-1 shadow-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            Đang Xem
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col grow">
        <h4 className="font-sans text-sm font-semibold line-clamp-2 text-primary group-hover:text-accent transition-colors duration-200 leading-snug">
          {video.title}
        </h4>

        <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-y-1 text-xs text-foreground/70 border-t border-border/30">
          {video.speaker && (
            <div className="flex items-center gap-1 font-medium text-primary/80">
              <User className="size-3 text-accent" />
              {video.speaker}
            </div>
          )}

          {video.views !== undefined && (
            <div className="flex items-center gap-1 font-mono">
              <Eye className="size-3" />
              {video.views.toLocaleString()} lượt xem
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
