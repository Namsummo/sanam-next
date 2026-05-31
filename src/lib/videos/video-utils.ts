import { Video } from "./types";

export function getDisplayVideos(videos: Video[]): Video[] {
  return videos.filter(
    (v) => v.category === "mass-event" || v.category === "hymn"
  );
}

function formatViDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatVideoDate(dateStr: string): string {
  return formatViDate(dateStr);
}

export function formatViewCount(count: number): string {
  return count.toLocaleString("vi-VN");
}
