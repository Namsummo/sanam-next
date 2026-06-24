"use client";

import { useState, useEffect, useMemo } from "react";
import { Radio, Tv, Calendar, User, Eye, RefreshCw } from "lucide-react";
import { Video, LiveSettings } from "@/lib/videos/types";
import type { YoutubeMetadata } from "@/lib/videos/youtube-metadata";
import {
  getStoredVideos,
  getStoredLiveSettings,
} from "@/lib/videos/mock-videos";
import {
  getDisplayVideos,
  formatVideoDate,
  formatViewCount,
} from "@/lib/videos/video-utils";
import { VideoCard } from "./video-card";
import { LiveChat } from "./live-chat";
import { VideoPlayerModal } from "./video-player-modal";
import { cn } from "@/lib/utils";

export function WorshipPlatform() {
  const [mounted, setMounted] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [liveSettings, setLiveSettings] = useState<LiveSettings>({
    isLive: false,
    youtubeId: "lYnBFKbKxU",
    youtubeUrl: "",
  });
  const [liveMetadata, setLiveMetadata] = useState<YoutubeMetadata | null>(null);
  const [metadataVideoId, setMetadataVideoId] = useState("");
  const [modalVideo, setModalVideo] = useState<Video | null>(null);

  const activeLiveMetadata =
    liveSettings.youtubeId && metadataVideoId === liveSettings.youtubeId
      ? liveMetadata
      : null;

  useEffect(() => {
    const initData = () => {
      setVideos(getStoredVideos());
      setLiveSettings(getStoredLiveSettings());
      setMounted(true);
    };

    const timer = setTimeout(initData, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!liveSettings.isLive || !liveSettings.youtubeId) return;

    let cancelled = false;

    const loadLiveMetadata = async () => {
      try {
        const response = await fetch(
          `/api/youtube/metadata?videoId=${encodeURIComponent(liveSettings.youtubeId)}`
        );

        if (!response.ok || cancelled) return;

        const data = (await response.json()) as YoutubeMetadata;
        if (!cancelled) {
          setLiveMetadata(data);
          setMetadataVideoId(liveSettings.youtubeId);
        }
      } catch {
        if (!cancelled) {
          setLiveMetadata(null);
          setMetadataVideoId(liveSettings.youtubeId);
        }
      }
    };

    loadLiveMetadata();

    return () => {
      cancelled = true;
    };
  }, [liveSettings.isLive, liveSettings.youtubeId]);

  const displayVideos = useMemo(() => getDisplayVideos(videos), [videos]);

  const massEventVideos = displayVideos.filter((v) => v.category === "mass-event");
  const hymnVideos = displayVideos.filter((v) => v.category === "hymn");

  if (!mounted) {
    return (
      <div className="w-full min-h-[600px] flex items-center justify-center text-primary/60">
        <RefreshCw className="size-8 animate-spin" />
        <span className="ml-3 font-sans font-medium text-sm">Đang tải truyền thông...</span>
      </div>
    );
  }

  const liveTitle = activeLiveMetadata?.title ?? "Đang phát trực tiếp";
  const liveDate = activeLiveMetadata?.publishedAt
    ? formatVideoDate(activeLiveMetadata.publishedAt)
    : formatVideoDate(new Date().toISOString().split("T")[0]);

  return (
    <div className="w-full py-8 md:py-12">
      <div className="mb-8 md:mb-10 text-center">
        <span
          className={cn(
            "relative mb-3 inline-flex items-center gap-1.5 rounded-full py-1.5 px-4 font-sans text-xs font-semibold uppercase leading-none",
            liveSettings.isLive
              ? "bg-accent/15 text-accent border border-accent/25"
              : "bg-muted text-foreground/80"
          )}
        >
          {liveSettings.isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
          )}
          {liveSettings.isLive ? "Đang Trực Tuyến" : "Thánh Lễ & Truyền Thông"}
        </span>
        <h1 className="font-display text-3xl font-bold uppercase leading-tight text-primary md:text-4xl lg:text-5xl">
          Phụng Vụ Truyền Thông
        </h1>
        <p className="mt-4 max-w-2xl mx-auto font-sans text-sm md:text-base text-foreground/80">
          Kênh truyền thông trực tuyến Giáo xứ Sa Nam. Nơi cập nhật các Thánh lễ trực tuyến, sự kiện phụng vụ và thánh ca tâm tình.
        </p>
      </div>

      {liveSettings.isLive ? (
        <section id="worship-player-section" className="mb-12 scroll-mt-24">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/5">
                {liveSettings.youtubeId ? (
                  <iframe
                    title={liveTitle}
                    src={`https://www.youtube.com/embed/${liveSettings.youtubeId}?autoplay=1&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/50 p-6">
                    <Tv className="size-16 text-white/20 mb-4" />
                    <p className="font-display text-lg uppercase font-semibold">Chưa có luồng phát</p>
                  </div>
                )}
              </div>

              <div className="mt-5 p-5 bg-card border border-border/40 rounded-2xl shadow-sm">
                <h2 className="font-sans text-xl font-bold text-primary leading-snug">
                  {liveTitle}
                </h2>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-foreground/80 border-t border-border/30 pt-4">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="size-4 text-accent" />
                    <span>{liveDate}</span>
                  </div>

                  {activeLiveMetadata?.authorName && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="size-4 text-accent" />
                      <span>{activeLiveMetadata.authorName}</span>
                    </div>
                  )}

                  {activeLiveMetadata?.viewCount != null && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <Eye className="size-4 text-accent" />
                      <span>{formatViewCount(activeLiveMetadata.viewCount)} lượt xem</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 font-semibold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
                    <Radio className="size-3.5" />
                    <span>PHÁT TRỰC TIẾP</span>
                  </div>
                </div>

                {liveSettings.description && (
                  <div className="mt-4 pt-4 border-t border-border/20">
                    <p className="text-sm text-foreground/85 font-sans leading-relaxed whitespace-pre-line">
                      {liveSettings.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="h-[400px] lg:h-auto min-h-[400px] flex flex-col lg:col-span-1">
              <LiveChat youtubeId={liveSettings.youtubeId} isLive={liveSettings.isLive} />
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-12">
          <div className="rounded-2xl border border-border/40 bg-card px-6 py-10 md:py-12 text-center">
            <Radio className="size-12 text-foreground/25 mx-auto mb-4" />
            <p className="font-display text-lg md:text-xl font-semibold text-primary">
              Hiện không có livestream nào đang được phát
            </p>
            <p className="mt-2 max-w-md mx-auto text-sm text-foreground/60">
              Vui lòng quay lại sau hoặc xem lại các video trong danh sách bên dưới.
            </p>
          </div>
        </section>
      )}

      <section className="space-y-12">
        <div className="w-full">
          <div className="flex items-center justify-between mb-5 border-b border-border/40 pb-2">
            <h3 className="font-display text-lg md:text-xl font-bold uppercase text-primary flex items-center gap-2">
              <Tv className="size-5 text-accent" />
              Thánh lễ & Sự kiện vừa diễn ra
            </h3>
            <span className="text-xs font-mono text-foreground/60">{massEventVideos.length} Video</span>
          </div>

          {massEventVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {massEventVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isActive={modalVideo?.id === video.id}
                  onSelect={setModalVideo}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-foreground/50 bg-card rounded-xl border border-border/30">
              Chưa có video thánh lễ hoặc sự kiện nào.
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between mb-5 border-b border-border/40 pb-2">
            <h3 className="font-display text-lg md:text-xl font-bold uppercase text-primary flex items-center gap-2">
              <Radio className="size-5 text-accent" />
              Thánh ca tâm tình
            </h3>
            <span className="text-xs font-mono text-foreground/60">{hymnVideos.length} Video</span>
          </div>

          {hymnVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hymnVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isActive={modalVideo?.id === video.id}
                  onSelect={setModalVideo}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-foreground/50 bg-card rounded-xl border border-border/30">
              Chưa có video thánh ca nào.
            </div>
          )}
        </div>
      </section>

      <VideoPlayerModal video={modalVideo} onClose={() => setModalVideo(null)} />
    </div>
  );
}
