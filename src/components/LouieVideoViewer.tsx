import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { LouieTranscriptSegment, LouieVideo } from "../louie";
import { formatLouieDate, formatLouieDuration, louiePublicUrl } from "../louie";

type MarkdownBlock =
  | { type: "heading"; depth: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "code"; language: string; text: string };

function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  function collectParagraph() {
    const parts: string[] = [];
    while (index < lines.length) {
      const current = lines[index];
      const trimmed = current.trim();
      if (!trimmed) break;
      if (/^#{1,3}\s+/.test(trimmed) || /^```/.test(trimmed) || /^>\s?/.test(trimmed) || /^(\d+\.\s+|[-*]\s+)/.test(trimmed)) {
        break;
      }
      parts.push(trimmed);
      index += 1;
    }
    if (parts.length) {
      blocks.push({ type: "paragraph", text: parts.join(" ") });
    }
  }

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const headingMatch = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        depth: headingMatch[1].length as 1 | 2 | 3,
        text: headingMatch[2].trim()
      });
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      index += 1;
      const codeLines: string[] = [];
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({ type: "code", language, text: codeLines.join("\n") });
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    if (/^(\d+\.\s+|[-*]\s+)/.test(trimmed)) {
      const ordered = /^\d+\.\s+/.test(trimmed);
      const items: string[] = [];
      while (index < lines.length && /^(\d+\.\s+|[-*]\s+)/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^(\d+\.\s+|[-*]\s+)/, ""));
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    collectParagraph();
    if (index < lines.length && !lines[index].trim()) {
      index += 1;
    }
  }

  return blocks;
}

function renderInlineMarkdown(text: string, keyPrefix: string) {
  const nodes: ReactNode[] = [];
  const tokenPattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let tokenIndex = 0;

  for (const match of text.matchAll(tokenPattern)) {
    const token = match[0];
    const start = match.index ?? 0;
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(<strong key={`${keyPrefix}-bold-${tokenIndex}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(<code key={`${keyPrefix}-code-${tokenIndex}`}>{token.slice(1, -1)}</code>);
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        nodes.push(
          <a key={`${keyPrefix}-link-${tokenIndex}`} href={linkMatch[2]} target="_blank" rel="noreferrer">
            {linkMatch[1]}
          </a>
        );
      }
    }

    lastIndex = start + token.length;
    tokenIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderMarkdownBlocks(blocks: MarkdownBlock[]) {
  return blocks.map((block, index) => {
    if (block.type === "heading") {
      const Tag = `h${block.depth}` as const;
      return <Tag key={index}>{block.text}</Tag>;
    }

    if (block.type === "paragraph") {
      return <p key={index}>{renderInlineMarkdown(block.text, `p-${index}`)}</p>;
    }

    if (block.type === "blockquote") {
      return <blockquote key={index}>{renderInlineMarkdown(block.text, `q-${index}`)}</blockquote>;
    }

    if (block.type === "code") {
      return (
        <pre key={index} className="louie-code-block">
          <code>{block.text}</code>
        </pre>
      );
    }

    return (
      <div key={index} className="louie-list-block">
        {block.ordered ? (
          <ol>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInlineMarkdown(item, `ol-${index}-${itemIndex}`)}</li>
            ))}
          </ol>
        ) : (
          <ul>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderInlineMarkdown(item, `ul-${index}-${itemIndex}`)}</li>
            ))}
          </ul>
        )}
      </div>
    );
  });
}

function TranscriptView({ segments, text }: { segments: LouieTranscriptSegment[] | null; text: string }) {
  if (!segments && !text) {
    return <div className="louie-empty-state">字幕还没有加载。</div>;
  }

  if (segments && segments.length > 0) {
    return (
      <div className="louie-transcript-list">
        {segments.map((segment, index) => (
          <div key={index} className="louie-transcript-row">
            <span className="louie-transcript-time">
              {formatTime(segment.start)}
            </span>
            <span className="louie-transcript-text">{segment.text}</span>
          </div>
        ))}
      </div>
    );
  }

  return <pre className="louie-transcript-text-block">{text}</pre>;
}

function isTranscriptSegmentArray(value: unknown): value is LouieTranscriptSegment[] {
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== "object") return false;
    const segment = item as Partial<LouieTranscriptSegment>;
    return typeof segment.text === "string"
      && typeof segment.start === "number"
      && typeof segment.duration === "number";
  });
}

function formatTime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function LouieVideoViewer({ video }: { video: LouieVideo | null }) {
  const [notesMarkdown, setNotesMarkdown] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [transcriptSegments, setTranscriptSegments] = useState<LouieTranscriptSegment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!video) {
      setNotesMarkdown("");
      setTranscriptText("");
      setTranscriptSegments(null);
      setLoading(false);
      setError("");
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setError("");
    setNotesMarkdown("");
    setTranscriptText("");
    setTranscriptSegments(null);

    const requests: Promise<void>[] = [];

    if (video.notesPath) {
      requests.push(
        fetch(louiePublicUrl(video.notesPath))
          .then((response) => {
            if (!response.ok) throw new Error(`notes load failed: ${response.status}`);
            return response.text();
          })
          .then((text) => {
            if (!cancelled) setNotesMarkdown(text);
          })
      );
    }

    if (video.transcriptJsonPath || video.transcriptTextPath) {
      requests.push(
        (async () => {
          let jsonFailure = "";

          if (video.transcriptJsonPath) {
            try {
              const response = await fetch(louiePublicUrl(video.transcriptJsonPath));
              if (!response.ok) throw new Error(`transcript json load failed: ${response.status}`);
              const parsed: unknown = await response.json();
              if (!isTranscriptSegmentArray(parsed)) {
                throw new Error("transcript json has an unexpected shape");
              }
              if (!cancelled) setTranscriptSegments(parsed);
              return;
            } catch (error) {
              jsonFailure = error instanceof Error ? error.message : String(error);
            }
          }

          if (video.transcriptTextPath) {
            const response = await fetch(louiePublicUrl(video.transcriptTextPath));
            if (!response.ok) throw new Error(`transcript text load failed: ${response.status}`);
            const text = await response.text();
            if (!cancelled) setTranscriptText(text);
            return;
          }

          if (jsonFailure) throw new Error(jsonFailure);
        })()
      );
    }

    Promise.allSettled(requests).then((results) => {
      if (cancelled) return;
      const failed = results.find((result) => result.status === "rejected") as PromiseRejectedResult | undefined;
      if (failed) {
        setError(failed.reason instanceof Error ? failed.reason.message : String(failed.reason));
      }
      setLoading(false);
    });

    if (requests.length === 0) {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [video]);

  const notesBlocks = useMemo(() => parseMarkdownBlocks(notesMarkdown), [notesMarkdown]);
  const notesContent = useMemo(() => renderMarkdownBlocks(notesBlocks), [notesBlocks]);

  if (!video) {
    return <div className="louie-empty-state">请先从左侧选择一个视频。</div>;
  }

  return (
    <div className="louie-video-viewer">
      <header className="louie-video-header">
        <div className="louie-video-title-group">
          <h1>{video.title}</h1>
          <div className="louie-meta-row">
            <span>{formatLouieDate(video.publishedAt)}</span>
            <span>{formatLouieDuration(video.durationSeconds)}</span>
          </div>
        </div>
        <div className="louie-video-links">
          <a href={video.url} target="_blank" rel="noreferrer">Open YouTube</a>
          {video.notesPath && (
            <a href={louiePublicUrl(video.notesPath)} target="_blank" rel="noreferrer">notes.md</a>
          )}
        </div>
      </header>

      <div className="source-frame louie-player-frame">
        <iframe
          title={video.title}
          src={`https://www.youtube.com/embed/${video.id}?rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <section className="louie-section">
        <h2>学习笔记</h2>
        {loading && !notesMarkdown && <div className="louie-empty-state">Loading notes...</div>}
        {error && <div className="louie-error">Error: {error}</div>}
        {!loading && notesContent.length === 0 && !notesMarkdown && (
          <div className="louie-empty-state">这个视频还没有笔记。</div>
        )}
        <div className="louie-notes">
          {notesContent}
        </div>
      </section>

      <details className="louie-transcript" open={false}>
        <summary>原始字幕</summary>
        <TranscriptView segments={transcriptSegments} text={transcriptText} />
      </details>
    </div>
  );
}
