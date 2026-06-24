import { Video, LiveSettings } from "./types";

const MASS_EVENT_VIDEO_ID = "lYnBFKbKxU";
const MASS_EVENT_VIDEO_URL = `https://www.youtube.com/watch?v=${MASS_EVENT_VIDEO_ID}`;
const MASS_EVENT_THUMBNAIL = `https://i.ytimg.com/vi/${MASS_EVENT_VIDEO_ID}/hqdefault.jpg`;

const HYMN_VIDEO_ID = "lYnBFKbKxU";
const HYMN_VIDEO_URL = `https://www.youtube.com/watch?v=${HYMN_VIDEO_ID}`;
const HYMN_THUMBNAIL = `https://i.ytimg.com/vi/${HYMN_VIDEO_ID}/hqdefault.jpg`;

export const defaultMockVideos: Video[] = [
  {
    id: "v-001",
    title: "Thánh Lễ Chúa Nhật Lễ Chúa Thánh Thần Hiện Xuống - Giáo Xứ Sa Nam",
    youtubeId: MASS_EVENT_VIDEO_ID,
    youtubeUrl: MASS_EVENT_VIDEO_URL,
    publishedAt: "2026-05-31",
    duration: "1:05:12",
    thumbnail: MASS_EVENT_THUMBNAIL,
    category: "mass-event",
    description:
      "Thánh lễ Chúa Nhật Chúa Thánh Thần Hiện Xuống được cử hành trực tuyến từ Nhà thờ Giáo xứ Sa Nam. Kính mời cộng đoàn hiệp thông cầu nguyện.",
    views: 1250,
    speaker: "Cha Chánh xứ",
  },
  {
    id: "v-002",
    title: "Nghi Thức Rước Kiệu Chúa Thánh Thể mừng Lễ Mình Máu Thánh Chúa",
    youtubeId: MASS_EVENT_VIDEO_ID,
    youtubeUrl: MASS_EVENT_VIDEO_URL,
    publishedAt: "2026-05-30",
    duration: "45:30",
    thumbnail: MASS_EVENT_THUMBNAIL,
    category: "mass-event",
    description:
      "Nghi thức cung nghinh Mình Thánh Chúa qua khuôn viên Giáo xứ Sa Nam với sự tham gia của đông đảo cộng đoàn dân Chúa.",
    views: 890,
    speaker: "Ban Phụng vụ",
  },
  {
    id: "v-003",
    title: "Thánh Lễ Khai Mạc Tháng Hoa Kính Đức Mẹ - Dâng Hoa Cộng Đoàn",
    youtubeId: MASS_EVENT_VIDEO_ID,
    youtubeUrl: MASS_EVENT_VIDEO_URL,
    publishedAt: "2026-05-01",
    duration: "1:12:45",
    thumbnail: MASS_EVENT_THUMBNAIL,
    category: "mass-event",
    description:
      "Đại diện các giáo họ dâng hoa kính Đức Mẹ Maria tại lễ đài nhân dịp khai mạc Tháng Hoa kính Đức Mẹ.",
    views: 2310,
    speaker: "Cha Tuyên úy",
  },
  {
    id: "v-007",
    title: "Thánh Ca Tâm Tình - Giáo Xứ Sa Nam",
    youtubeId: HYMN_VIDEO_ID,
    youtubeUrl: HYMN_VIDEO_URL,
    publishedAt: "2026-05-20",
    duration: "05:14",
    thumbnail: HYMN_THUMBNAIL,
    category: "hymn",
    description: "Tuyển tập thánh ca tâm tình dâng lên Thiên Chúa và Đức Mẹ.",
    views: 5200,
    speaker: "Ca đoàn Giáo xứ Sa Nam",
  },
  {
    id: "v-008",
    title: "Thánh Ca Tâm Tình - Giáo Xứ Sa Nam",
    youtubeId: HYMN_VIDEO_ID,
    youtubeUrl: HYMN_VIDEO_URL,
    publishedAt: "2026-05-10",
    duration: "06:30",
    thumbnail: HYMN_THUMBNAIL,
    category: "hymn",
    description: "Thánh ca suy niệm êm dịu giúp cộng đoàn lắng đọng tâm hồn.",
    views: 2900,
    speaker: "Ca đoàn Giáo xứ Sa Nam",
  },
  {
    id: "v-009",
    title: "Thánh Ca Tâm Tình - Giáo Xứ Sa Nam",
    youtubeId: HYMN_VIDEO_ID,
    youtubeUrl: HYMN_VIDEO_URL,
    publishedAt: "2026-05-25",
    duration: "04:52",
    thumbnail: HYMN_THUMBNAIL,
    category: "hymn",
    description: "Ca khúc dâng lễ được thể hiện bởi Ca đoàn Giáo xứ Sa Nam.",
    views: 1540,
    speaker: "Ca đoàn Trầm Hương",
  },
];

export const defaultLiveSettings: LiveSettings = {
  isLive: true,
  youtubeId: "TfYsAVvxtpw",
  youtubeUrl: "https://www.youtube.com/watch?v=TfYsAVvxtpw",
};

const STORAGE_KEYS = {
  VIDEOS: "sanam_worship_videos",
  LIVE: "sanam_worship_live",
};

export function getStoredVideos(): Video[] {
  if (typeof window === "undefined") return defaultMockVideos;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    const parsed = (data ? JSON.parse(data) : defaultMockVideos) as Video[];
    return parsed.filter(
      (v) => v.category === "mass-event" || v.category === "hymn",
    );
  } catch (e) {
    console.error("Error reading stored videos", e);
    return defaultMockVideos;
  }
}

export function saveStoredVideos(videos: Video[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  } catch (e) {
    console.error("Error saving videos to store", e);
  }
}

export function getStoredLiveSettings(): LiveSettings {
  if (typeof window === "undefined") return defaultLiveSettings;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LIVE);
    return data ? JSON.parse(data) : defaultLiveSettings;
  } catch (e) {
    console.error("Error reading live settings", e);
    return defaultLiveSettings;
  }
}

export function saveStoredLiveSettings(settings: LiveSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.LIVE, JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving live settings", e);
  }
}

export function extractYoutubeId(urlOrId: string): string {
  const clean = urlOrId.trim();
  if (clean.length === 11) return clean;

  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
  const match = clean.match(regExp);

  return match && match[2].length === 11 ? match[2] : clean;
}
