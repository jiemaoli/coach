import { useEffect, useMemo, useState } from "react";
import {
  LOUIE_CHANNEL_URL,
  type LouieCategory,
  type LouieManifest,
  type LouieVideo,
  formatLouieDate,
  formatLouieDuration
} from "../louie";
import { LouieVideoViewer } from "./LouieVideoViewer";

type LouieWorkspaceProps = {
  manifest: LouieManifest | null;
};

function buildVideoHaystack(video: LouieVideo, categoryTitles: Map<string, string>, playlistTitles: Map<string, string>) {
  return [
    video.title,
    video.url,
    video.learningStatus,
    video.notesStatus,
    video.tags.join(" "),
    video.titleKeywords.join(" "),
    formatLouieDate(video.publishedAt),
    formatLouieDuration(video.durationSeconds),
    ...video.categoryIds.map((id) => categoryTitles.get(id) ?? id),
    ...video.playlistIds.map((id) => playlistTitles.get(id) ?? id)
  ].join(" ").toLowerCase();
}

function categoryCount(categories: LouieCategory[], videos: LouieVideo[]) {
  const counts = new Map<string, number>();
  for (const video of videos) {
    const ids = video.categoryIds.length > 0 ? video.categoryIds : ["misc"];
    for (const id of ids) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  return categories.map((category) => ({
    ...category,
    count: counts.get(category.id) ?? 0
  }));
}

function LouieMiniLinks() {
  return (
    <div className="louie-mini-links">
      <a href="/louie" aria-current="page">视频</a>
      <a href="/louie/vocabulary">词汇表</a>
      <a href={LOUIE_CHANNEL_URL} target="_blank" rel="noreferrer">YouTube</a>
    </div>
  );
}

export function LouieWorkspace({ manifest }: LouieWorkspaceProps) {
  const [playlistId, setPlaylistId] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");
  const [activeVideoId, setActiveVideoId] = useState("");

  const playlistMap = useMemo(() => new Map((manifest?.playlists ?? []).map((playlist) => [playlist.id, playlist.title] as const)), [manifest]);
  const categoryMap = useMemo(() => new Map((manifest?.categories ?? []).map((category) => [category.id, category.title] as const)), [manifest]);

  const playlistOptions = useMemo(() => [
    { id: "all", title: "全部播放列表" },
    ...(manifest?.playlists ?? []).map((playlist) => ({
      id: playlist.id,
      title: playlist.title
    }))
  ], [manifest]);

  const filteredByPlaylist = useMemo(() => {
    const videos = manifest?.videos ?? [];
    if (playlistId === "all") return videos;
    return videos.filter((video) => video.playlistIds.includes(playlistId));
  }, [manifest, playlistId]);

  const categoryOptions = useMemo(() => {
    const categories = manifest?.categories ?? [];
    const withCounts = categoryCount(categories, filteredByPlaylist);
    return [
      { id: "all", title: "全部分类", description: "显示所有视频", order: 0, videoIds: [], tags: [], count: filteredByPlaylist.length },
      ...withCounts
    ];
  }, [manifest, filteredByPlaylist]);

  const filteredVideos = useMemo(() => {
    const q = query.trim().toLowerCase();
    return filteredByPlaylist.filter((video) => {
      if (categoryId !== "all") {
        const ids = video.categoryIds.length > 0 ? video.categoryIds : ["misc"];
        if (!ids.includes(categoryId)) return false;
      }

      if (!q) return true;

      const haystack = buildVideoHaystack(video, categoryMap, playlistMap);
      return haystack.includes(q);
    });
  }, [categoryId, categoryMap, filteredByPlaylist, playlistMap, query]);

  useEffect(() => {
    if (filteredVideos.length === 0) {
      setActiveVideoId("");
      return;
    }

    if (!filteredVideos.some((video) => video.id === activeVideoId)) {
      setActiveVideoId(filteredVideos[0].id);
    }
  }, [activeVideoId, filteredVideos]);

  const activeVideo = manifest?.videos.find((video) => video.id === activeVideoId) ?? null;

  if (!manifest) {
    return (
      <div className="louie-shell">
        <aside className="louie-sidebar">
          <div className="louie-brand">
            <span>LPA</span>
            <div>
              <strong>Louie Price Action</strong>
              <small>Loading source...</small>
            </div>
          </div>
          <LouieMiniLinks />
        </aside>
        <main className="louie-main">
          <div className="app-loading">Loading Louie archive...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="louie-shell">
      <aside className="louie-sidebar">
        <div className="louie-brand">
          <span>LPA</span>
          <div>
            <strong>{manifest.title}</strong>
            <small>{manifest.videoCount} videos · {manifest.playlists.length} playlists</small>
          </div>
        </div>

        <LouieMiniLinks />

        <div className="louie-filter-group">
          <span className="louie-filter-label">播放列表</span>
          <div className="louie-chip-list">
            {playlistOptions.map((playlist) => (
              <button
                key={playlist.id}
                type="button"
                className={playlist.id === playlistId ? "active" : ""}
                onClick={() => setPlaylistId(playlist.id)}
              >
                {playlist.title}
              </button>
            ))}
          </div>
        </div>

        <div className="louie-filter-group">
          <span className="louie-filter-label">分类目录</span>
          <div className="louie-category-list">
            {categoryOptions.map((category) => (
              <button
                key={category.id}
                type="button"
                className={category.id === categoryId ? "active" : ""}
                onClick={() => setCategoryId(category.id)}
                title={category.description}
              >
                <span>{category.title}</span>
                <strong>{category.count}</strong>
              </button>
            ))}
          </div>
        </div>

        <label className="louie-search">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、标签、分类..."
          />
        </label>
      </aside>

      <main className="louie-main">
        <section className="louie-workspace">
          <aside className="louie-list-panel">
            <div className="louie-panel-title">
              <h2>Videos</h2>
              <span>{filteredVideos.length}</span>
            </div>
            <div className="louie-video-list">
              {filteredVideos.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  className={video.id === activeVideoId ? "active" : ""}
                  onClick={() => setActiveVideoId(video.id)}
                >
                  <span>{formatLouieDate(video.publishedAt)}</span>
                  <strong>{video.title}</strong>
                  <small>
                    {formatLouieDuration(video.durationSeconds)}
                    {video.primaryCategoryId && ` · ${categoryMap.get(video.primaryCategoryId) ?? video.primaryCategoryId}`}
                  </small>
                </button>
              ))}
            </div>
          </aside>

          <article className="louie-reader-panel">
            <LouieVideoViewer video={activeVideo} />
          </article>
        </section>
      </main>
    </div>
  );
}
