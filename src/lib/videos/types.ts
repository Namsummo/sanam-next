export type VideoCategory = "mass-event" | "hymn";

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  youtubeUrl: string;
  publishedAt: string; // ISO date string or formatted date
  duration: string; // e.g., "1:15:20"
  thumbnail: string;
  category: VideoCategory;
  description?: string;
  views?: number;
  speaker?: string; // Priest or singer name
}

export interface LiveSettings {
  isLive: boolean;
  youtubeId: string;
  youtubeUrl: string;
  title?: string;
  description?: string;
  startedAt?: string;
}
