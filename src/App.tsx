import { useEffect, useMemo, useRef, useState } from "react";

type BlogImage = {
  url: string;
  localPath: string | null;
  publicPath?: string | null;
  filename: string;
};

type BlogPost = {
  id: string;
  title: string;
  published: string;
  updated: string;
  url: string;
  htmlPath: string;
  textPath: string;
  labels: string[];
  setupCandidates: string[];
  excerpt: string;
  imageCount: number;
  images: BlogImage[];
  searchText?: string;
};

type BlogManifest = {
  source: string;
  generatedAt: string;
  postCount: number;
  imageCount: number;
  posts: BlogPost[];
};

type StudyStage = {
  id: string;
  title: string;
  authorEvidence: string;
  postIds: string[];
  tags: string[];
};

const archiveBase = "/ninetrans-blog";

const studyPath: StudyStage[] = [
  {
    id: "start",
    title: "起步：Rule of Ten 与只做 A2",
    authorEvidence: "作者写给 rank beginner：first step 是 SIM；并明确说 start with A2 and stick to A2 only.",
    postIds: ["nt-2011-01-29-the-rule-of-ten-a-trading-plan", "nt-2011-01-17-four-trades-off-nine-transitions"],
    tags: ["beginner", "A2", "SIM"]
  },
  {
    id: "bar-selection",
    title: "读图基础：Signal bar selection",
    authorEvidence: "作者明确写道：The very first thing to learn about price action trading is signal bar selection.",
    postIds: [
      "nt-2011-09-13-price-action-basics-i-bar-selection",
      "nt-2011-09-15-price-action-basics-ii-failure-to-fail",
      "nt-2011-09-19-price-action-basics-iii-bar-counting"
    ],
    tags: ["signal bar", "doji", "bar counting"]
  },
  {
    id: "market-state",
    title: "市场状态：能交易与不能交易",
    authorEvidence: "The first principles: 先区分市场什么时候 tradeable，什么时候 not tradeable.",
    postIds: [
      "nt-2014-01-23-the-first-principles",
      "nt-2014-02-21-trend-and-chop",
      "nt-2011-07-25-trading-barb-wire",
      "nt-2015-09-22-trading-a-choppy-day"
    ],
    tags: ["trend", "chop", "barb wire"]
  },
  {
    id: "a2",
    title: "新手窄化训练：A2",
    authorEvidence: "Rule of Ten: You should start with A2 and stick to A2 only. Four trades: new traders should just stick to A2.",
    postIds: [
      "nt-2011-01-17-four-trades-off-nine-transitions",
      "nt-2013-12-02-smaller-stops-larger-gains",
      "nt-2014-01-16-tight-stops-and-other-simplifications"
    ],
    tags: ["A2", "pullback", "entry"]
  },
  {
    id: "first-pullback",
    title: "1PB / Openers：清楚才做",
    authorEvidence: "The first pullback: 1PB is usually the best setup for new traders, if they can skip days without a clear 1PB.",
    postIds: [
      "nt-2011-05-11-the-first-pullback",
      "nt-2015-09-17-the-openers-1w-first-wedge-and-1p-the-first-pullback-in-a-trend",
      "nt-2014-02-18-the-openers-1w",
      "nt-2015-09-16-openers-ib2"
    ],
    tags: ["1PB", "1W", "openers"]
  },
  {
    id: "execution",
    title: "执行与风险：少而好",
    authorEvidence: "Fewer, better trades: 新手最大错误之一是 overtrading. 新 setup 要先在 disciplined SIM 中验证.",
    postIds: [
      "nt-2011-11-09-fewer-better-trades",
      "nt-2011-11-13-two-strikes",
      "nt-2011-12-05-overconfidence",
      "nt-2011-10-03-price-action-basics-ix-scalp-and-swing-entries"
    ],
    tags: ["overtrading", "two strikes", "SIM"]
  }
];

function normalizePath(path: string | null | undefined) {
  if (!path) return "";
  return path.replace(/^docs\/ninetrans-blog\//, "").replace(/^public\/ninetrans-blog\//, "");
}

function publicUrl(path: string | null | undefined) {
  const normalized = normalizePath(path);
  return normalized ? `${archiveBase}/${normalized}` : "";
}

export function App() {
  const [manifest, setManifest] = useState<BlogManifest | null>(null);
  const [activeStageId, setActiveStageId] = useState(studyPath[0].id);
  const [activePostId, setActivePostId] = useState("");
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState("");
  const [zoomImage, setZoomImage] = useState("");

  useEffect(() => {
    fetch(`${archiveBase}/manifest.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`manifest load failed: ${response.status}`);
        return response.json() as Promise<BlogManifest>;
      })
      .then((data) => {
        setManifest(data);
        const firstPathPost = studyPath.flatMap((stage) => stage.postIds)
          .map((id) => data.posts.find((post) => post.id === id))
          .find(Boolean);
        setActivePostId(firstPathPost?.id ?? data.posts[0]?.id ?? "");
      })
      .catch((error: Error) => setLoadError(error.message));
  }, []);

  const posts = manifest?.posts ?? [];
  const postById = useMemo(() => new Map(posts.map((post) => [post.id, post])), [posts]);
  const activeStage = studyPath.find((stage) => stage.id === activeStageId) ?? studyPath[0];
  const activePost = postById.get(activePostId) ?? posts[0];
  const pathPosts = activeStage.postIds.map((id) => postById.get(id)).filter((post): post is BlogPost => Boolean(post));

  const filteredPosts = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return posts;
    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.published,
        post.excerpt,
        post.searchText,
        ...(post.setupCandidates ?? []),
        ...(post.labels ?? [])
      ].join(" ").toLowerCase();
      return haystack.includes(value);
    });
  }, [posts, query]);

  function openPost(postId: string) {
    setActivePostId(postId);
  }

  if (loadError) return <main className="app-error">博客归档加载失败：{loadError}</main>;
  if (!manifest || !activePost) return <main className="app-loading">正在读取 Nine Transitions 本地归档...</main>;

  return (
    <div className="reader-shell">
      <aside className="reader-sidebar">
        <div className="brand-block">
          <span>NT</span>
          <div>
            <strong>Nine Transitions Reader</strong>
            <small>{manifest.postCount} posts · {manifest.imageCount} images</small>
          </div>
        </div>

        <nav className="stage-nav" aria-label="学习路径">
          {studyPath.map((stage, index) => (
            <button
              key={stage.id}
              className={stage.id === activeStage.id ? "active" : ""}
              type="button"
              onClick={() => {
                setActiveStageId(stage.id);
                const first = stage.postIds.map((id) => postById.get(id)).find(Boolean);
                if (first) openPost(first.id);
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {stage.title}
            </button>
          ))}
        </nav>

        <section className="path-context">
          <p>{activeStage.authorEvidence}</p>
          <div>
            {activeStage.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </section>
      </aside>

      <main className="reader-main">
        <section className="top-bar">
          <div className="path-posts">
            {pathPosts.map((post) => (
              <button
                key={post.id}
                className={post.id === activePost.id ? "active" : ""}
                type="button"
                onClick={() => openPost(post.id)}
              >
                <span>{post.published.slice(0, 10)}</span>
                <strong>{post.title}</strong>
              </button>
            ))}
          </div>
          <label className="global-search">
            <span>全局搜索</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="A2, 1PB, signal bar, chop..."
            />
          </label>
        </section>

        <section className="workspace">
          <aside className="library-panel">
            <div className="panel-title">
              <h2>{query ? "搜索结果" : "文章库"}</h2>
              <span>{filteredPosts.length}</span>
            </div>
            <div className="post-list">
              {filteredPosts.slice(0, 220).map((post) => (
                <button
                  key={post.id}
                  className={post.id === activePost.id ? "active" : ""}
                  type="button"
                  onClick={() => openPost(post.id)}
                >
                  <span>{post.published.slice(0, 10)} · {post.imageCount} img</span>
                  <strong>{post.title}</strong>
                </button>
              ))}
            </div>
          </aside>

          <article className="reader-panel">
            <header className="reader-header">
              <span>{activePost.published.slice(0, 10)}</span>
              <a href={activePost.url} target="_blank" rel="noreferrer">博客原文</a>
              <a href={publicUrl(activePost.textPath)} target="_blank" rel="noreferrer">TXT</a>
            </header>
            <OriginalPost post={activePost} onZoomImage={setZoomImage} />
          </article>
        </section>
      </main>

      {zoomImage && (
        <button className="image-lightbox" type="button" onClick={() => setZoomImage("")} aria-label="关闭图片放大">
          <img src={zoomImage} alt="" />
        </button>
      )}
    </div>
  );
}

function OriginalPost({ post, onZoomImage }: { post: BlogPost; onZoomImage: (src: string) => void }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  function wireImageZoom() {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    doc.querySelectorAll("img").forEach((image) => {
      image.style.cursor = "zoom-in";
      image.addEventListener("click", () => {
        const src = image.getAttribute("src");
        if (src) onZoomImage(new URL(src, window.location.origin).href);
      });
    });
  }

  return (
    <section className="source-frame">
      <iframe ref={iframeRef} title={post.title} src={publicUrl(post.htmlPath)} onLoad={wireImageZoom} />
    </section>
  );
}
