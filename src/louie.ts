export const LOUIE_SOURCE_ID = "louie-price-action" as const;
export const LOUIE_BASE_PATH = "/louie-price-action";
export const LOUIE_MANIFEST_URL = `${LOUIE_BASE_PATH}/manifest.json`;
export const LOUIE_VOCABULARY_URL = `${LOUIE_BASE_PATH}/vocabulary.md`;
export const LOUIE_CHANNEL_URL = "https://www.youtube.com/@LouiePriceAction";
export const LOUIE_PRICE_ACTION_PLAYLIST_URL = "https://www.youtube.com/watch?v=152osf_ULas&list=PLrCXUGuTXtGIFMUpj_BB6Uoa-xUOYEZDE";

export type LouieTranscriptSegment = {
  start: number;
  duration: number;
  text: string;
};

export type LouiePlaylist = {
  id: string;
  title: string;
  url: string;
  order: number;
  videoIds: string[];
};

export type LouieCategory = {
  id: string;
  title: string;
  description: string;
  order: number;
  videoIds: string[];
  tags: string[];
};

export type LouieVideo = {
  id: string;
  sourceId: string;
  platform: "youtube";
  title: string;
  url: string;
  publishedAt: string | null;
  durationSeconds: number | null;
  playlistIds: string[];
  primaryCategoryId: string;
  categoryIds: string[];
  transcriptLanguage: string;
  transcriptKind: "manual" | "auto" | "unknown";
  transcriptJsonPath: string;
  transcriptTextPath: string;
  transcriptHash: string;
  notesPath: string | null;
  notesStatus: "none" | "draft" | "reviewed";
  learningStatus: "fetched" | "worth-summarizing" | "summarized" | "reviewed";
  tags: string[];
  titleKeywords: string[];
  fetchedAt: string;
  updatedAt: string;
};

export type LouieManifest = {
  schemaVersion: 1;
  sourceId: string;
  title: string;
  channelUrl: string;
  generatedAt: string;
  videoCount: number;
  playlists: LouiePlaylist[];
  categories: LouieCategory[];
  videos: LouieVideo[];
};

export function louiePublicUrl(path: string | null | undefined) {
  if (!path) return "";
  if (path.startsWith("/")) return path;
  return `${LOUIE_BASE_PATH}/${path}`;
}

export function formatLouieDuration(seconds: number | null | undefined) {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) return "未知";

  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function formatLouieDate(value: string | null | undefined) {
  if (!value) return "未知";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

export function buildLouieVideoKeywords(title: string, tags: string[] = []) {
  const base = title
    .split(/[\s、,，/|]+/g)
    .map((part) => part.trim())
    .filter(Boolean);

  return [...new Set([...base, ...tags])].slice(0, 12);
}
