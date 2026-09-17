import { Video } from "./types";

export function getDisplayVideos(videos: Video[]): Video[] {
  return videos.filter(
    (v) => v.category === "mass-event" || v.category === "hymn"
  );
}

export function formatViewCount(count: number): string {
  return count.toLocaleString("vi-VN");
}
