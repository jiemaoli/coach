import { LOUIE_CHANNEL_URL, LOUIE_VOCABULARY_URL } from "../louie";
import { VocabularyViewer } from "./VocabularyViewer";

export function LouieVocabularyPage() {
  return (
    <div className="louie-shell louie-vocabulary-shell">
      <aside className="louie-sidebar">
        <div className="louie-brand">
          <span>LPA</span>
          <div>
            <strong>Louie Price Action</strong>
            <small>Vocabulary</small>
          </div>
        </div>

        <div className="louie-mini-links">
          <a href="/louie">视频</a>
          <a href="/louie/vocabulary" aria-current="page">词汇表</a>
          <a href={LOUIE_CHANNEL_URL} target="_blank" rel="noreferrer">YouTube</a>
        </div>
      </aside>

      <main className="louie-main">
        <section className="louie-vocabulary-pane">
          <VocabularyViewer markdownUrl={LOUIE_VOCABULARY_URL} title="Louie Vocabulary" />
        </section>
      </main>
    </div>
  );
}
