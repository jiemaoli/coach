import { useEffect, useMemo, useState } from "react";

type VocabEntry = {
  word: string;
  type: string;
  meaning: string;
  context: string;
  isCore?: boolean;
};

type VocabularySection = {
  title: string;
  entries: VocabEntry[];
};

type VocabularyViewerProps = {
  markdownUrl: string;
  title?: string;
  coreTerms?: string[];
};

const DEFAULT_CORE_TERMS = ["A2", "W1P", "DP", "fBO", "W", "1CBO"];

function isTableHeader(line: string) {
  return /单词\/短语|word\/phrase|术语|term|词汇/i.test(line);
}

function inferEntryType(word: string, meaning: string) {
  if (word.includes("SIM") || word.toLowerCase().includes("beginner")) return "CONCEPT";
  if (meaning.includes("交易") && !meaning.includes("术语")) return "SETUP";
  if (meaning.includes("心态") || meaning.includes("心理")) return "PSYCH";
  return "TERM";
}

function parseVocabularyMarkdown(
  markdown: string,
  coreTerms: string[],
): { sections: VocabularySection[] } {
  const lines = markdown.split("\n");
  const sections: VocabularySection[] = [];
  let currentSection: VocabularySection | null = null;
  let currentEntry: Partial<VocabEntry> | null = null;
  let contextBuffer: string[] = [];

  function ensureSection() {
    if (!currentSection) {
      currentSection = { title: "Vocabulary", entries: [] };
    }
    return currentSection;
  }

  function flushEntry() {
    if (currentEntry && currentSection) {
      currentSection.entries.push({
        word: currentEntry.word || "",
        type: currentEntry.type || "TERM",
        meaning: currentEntry.meaning || "",
        context: contextBuffer.join(" ").trim(),
        isCore: currentEntry.isCore
      });
    }
    currentEntry = null;
    contextBuffer = [];
  }

  function flushSection() {
    if (currentSection) {
      flushEntry();
      if (currentSection.entries.length > 0) {
        sections.push(currentSection);
      }
    }
    currentSection = null;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("# ") || trimmed.startsWith("## ")) {
      flushSection();
      const title = trimmed.replace(/^#+\s*/, "");
      currentSection = { title, entries: [] };
      continue;
    }

    if (!trimmed || trimmed.startsWith("---")) continue;

    if (trimmed.startsWith("|") && isTableHeader(trimmed)) {
      ensureSection();
      continue;
    }

    if (trimmed.startsWith("|") && !trimmed.startsWith("|---")) {
      const cells = trimmed.split("|").filter((cell) => cell.trim()).map((cell) => cell.trim());

      if (cells.length >= 2) {
        flushEntry();
        const section = ensureSection();
        const word = cells[0].replace(/\*\*/g, "");
        const meaning = cells[1] ?? "";
        const context = cells[2] ?? "";
        const isCore = coreTerms.some((term) => word.includes(term));

        currentEntry = {
          word,
          meaning,
          type: inferEntryType(word, meaning),
          isCore
        };
        contextBuffer = [context];
        currentSection = section;
      }
    } else if (currentEntry && trimmed) {
      contextBuffer.push(trimmed);
    }
  }

  flushSection();
  return { sections };
}

export function VocabularyViewer({
  markdownUrl,
  title = "Trading Vocabulary",
  coreTerms = DEFAULT_CORE_TERMS
}: VocabularyViewerProps) {
  const [data, setData] = useState<{ sections: VocabularySection[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(markdownUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const parsed = parseVocabularyMarkdown(text, coreTerms);
        setData(parsed);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [markdownUrl, coreTerms]);

  const filteredData = useMemo(() => {
    if (!data || !searchQuery.trim()) return data;

    const q = searchQuery.toLowerCase().trim();
    const filtered = data.sections.map((section) => ({
      ...section,
      entries: section.entries.filter((entry) =>
        entry.word.toLowerCase().includes(q) ||
        entry.meaning.toLowerCase().includes(q) ||
        entry.context.toLowerCase().includes(q) ||
        entry.type.toLowerCase().includes(q)
      )
    })).filter((section) => section.entries.length > 0);

    return { sections: filtered };
  }, [data, searchQuery]);

  if (loading) return <div className="vocab-loading">Loading vocabulary...</div>;
  if (error) return <div className="vocab-error">Error: {error}</div>;
  if (!data) return null;

  const totalEntries = data.sections.reduce((sum, section) => sum + section.entries.length, 0);
  const coreCount = data.sections.reduce((sum, section) => sum + section.entries.filter((entry) => entry.isCore).length, 0);
  const filteredCount = filteredData?.sections.reduce((sum, section) => sum + section.entries.length, 0) ?? totalEntries;

  return (
    <div className="vocabulary-viewer">
      <div className="vocab-header">
        <h1>{title}</h1>
        <div className="vocab-stats">
          <span className="stat-item"><span className="number">{totalEntries}</span> terms</span>
          <span className="stat-item"><span className="number">{coreCount}</span> core</span>
        </div>
        <div className="vocab-search">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search..."
          />
          {searchQuery && (
            <span className="search-count">{filteredCount}/{totalEntries}</span>
          )}
        </div>
      </div>

      {filteredData && filteredData.sections.length === 0 && (
        <div className="vocab-no-results">
          No results for "{searchQuery}"
        </div>
      )}

      {totalEntries === 0 && !searchQuery && (
        <div className="vocab-no-results">
          这个词汇表还没有条目。
        </div>
      )}

      {filteredData?.sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="vocab-section">
          {section.title !== "Vocabulary" && <h2 className="section-title">{section.title}</h2>}
          <div className="vocab-grid">
            {section.entries.map((entry, entryIndex) => (
              <div key={entryIndex} className={`vocab-card ${entry.isCore ? "core-setup" : ""}`}>
                <div className="vocab-term">
                  <span className="vocab-word">{entry.word}</span>
                  <span className="vocab-type">{entry.type}</span>
                  {entry.isCore && <span className="core-badge">CORE</span>}
                </div>
                <div className="vocab-meaning">{entry.meaning}</div>
                {entry.context && (
                  <div className="vocab-context">
                    {entry.context}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
