import { useMemo, useState } from "react";
import { CandleChart } from "./components/CandleChart";
import {
  chartCases,
  examSetupMap,
  exams,
  glossary,
  learningPath,
  lessons,
  preTradeChecklist,
  simTrainingGates,
  type ChartCase,
  type ExamQuestion,
  type GlossaryEntry,
  type LessonModule,
  type LessonUnit,
  type ModuleId
} from "./data/content";
import {
  matchesSetupFilter,
  type SetupFilter
} from "./domain/setupAccess";
import type { SetupId } from "./domain/setup";
import { useProgress } from "./hooks/useProgress";

const navItems: { id: ModuleId; label: string }[] = [
  { id: "dashboard", label: "总览" },
  { id: "course", label: "课程" },
  { id: "cases", label: "图表案例" },
  { id: "exam", label: "考试" },
  { id: "training", label: "训练" },
  { id: "glossary", label: "术语" }
];

const moduleLabels = {
  bar: "Bar",
  a2: "A2",
  structure: "Structure",
  w1p: "W1P",
  dp: "DP",
  fbo: "fBO",
  risk: "Risk"
} satisfies Record<LessonModule, string>;

type DerivedSetup = SetupFilter | "foundation";

const setupTabs: { id: SetupFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "foundation", label: "Basics" },
  { id: "a2", label: "A2" },
  { id: "w1p", label: "W1P" },
  { id: "dp", label: "DP" },
  { id: "fbo", label: "fBO" }
];

const foundationModules = new Set<LessonModule>(["bar", "structure", "risk"]);

const setupDescriptions: Record<SetupFilter, string> = {
  all: "查看全部 setup 与通用基础内容，用于横向浏览和复盘对照。",
  foundation: "通用基础：Signal Bar、趋势/区间结构、风险与纪律。",
  a2: "聚焦 A2：二腿回调、信号质量、趋势延续执行。",
  w1p: "聚焦 W1P：三推回调、first pullback reversal 与确认执行。",
  dp: "聚焦 DP：double test、失败确认与边界反转。",
  fbo: "聚焦 fBO：突破失败、回区间确认与反向执行。"
};

const setupMasteryLabels: Record<SetupId, string> = {
  foundation: "Basics",
  a2: "A2",
  w1p: "W1P",
  dp: "DP",
  fbo: "fBO"
};

const masteryStatusLabels = {
  locked: "Ready",
  available: "Ready",
  "in-progress": "Training",
  passed: "Passed",
  "needs-review": "Review",
  "not-assessable": "No data"
} as const;

const examModeLabels: Record<ExamQuestion["mode"], string> = {
  concept: "概念题",
  case: "看图题",
  execution: "执行题"
};

function getLessonSetup(lesson: LessonUnit): DerivedSetup {
  if (foundationModules.has(lesson.module)) return "foundation";
  if (lesson.module === "a2" || lesson.module === "w1p" || lesson.module === "dp" || lesson.module === "fbo") {
    return lesson.module;
  }

  return "foundation";
}

function getChartCaseSetup(chartCase: ChartCase): SetupFilter {
  const text = `${chartCase.setup} ${chartCase.title} ${chartCase.context} ${chartCase.learnerTask}`.toLowerCase();

  if (text.includes("w1p") || text.includes("wedge pullback")) return "w1p";
  if (text.includes("fbo") || text.includes("failed breakout")) return "fbo";
  if (text.includes("dp") || text.includes("double test")) return "dp";
  if (
    text.includes("a2") ||
    text.includes("a22") ||
    text.includes("fa2") ||
    text.includes("failed a2") ||
    text.includes("classic a2") ||
    text.includes("breakout pullback a2")
  ) {
    return "a2";
  }

  return "all";
}

function getExamSetup(exam: ExamQuestion): SetupFilter {
  return examSetupMap.get(exam.id) ?? "all";
}

function getGlossarySetup(entry: GlossaryEntry): SetupFilter {
  const text = [entry.id, entry.term, entry.pdfEnglish, entry.detail, entry.example, entry.short]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (text.includes("w1p") || text.includes("wedge pullback")) return "w1p";
  if (text.includes("fbo") || text.includes("failed breakout")) return "fbo";
  if (text.includes("dp") || text.includes("double test") || text.includes("double top") || text.includes("double bottom")) return "dp";
  if (text.includes("a22") || text.includes("fa2") || text.includes("a2") || text.includes("failed a2")) return "a2";

  return "all";
}

function getVisibleLessons(activeSetup: SetupFilter) {
  return lessons.filter((lesson) => matchesSetupFilter(getLessonSetup(lesson), activeSetup));
}

function getVisibleCases(activeSetup: SetupFilter) {
  return chartCases.filter((chartCase) => matchesSetupFilter(getChartCaseSetup(chartCase), activeSetup));
}

export function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
  const [activeSetup, setActiveSetup] = useState<SetupFilter>("all");
  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id);
  const [activeCaseId, setActiveCaseId] = useState(chartCases[0].id);
  const [examMode, setExamMode] = useState<ExamQuestion["mode"]>("case");
  const [activeExamIndex, setActiveExamIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const { progress, mastery, completedSet, toggleSection, recordQuiz, toggleRule10, resetProgress, exportProgress } = useProgress();

  const visibleLessons = useMemo(() => getVisibleLessons(activeSetup), [activeSetup]);

  const visibleCases = useMemo(() => getVisibleCases(activeSetup), [activeSetup]);
  const examPool = useMemo(
    () => exams.filter((exam) => exam.mode === examMode && matchesSetupFilter(getExamSetup(exam), activeSetup)),
    [activeSetup, examMode]
  );

  const filteredGlossary = useMemo(() => {
    const query = glossaryQuery.trim().toLowerCase();

    return glossary
      .map((entry) => ({ entry, setup: getGlossarySetup(entry) }))
      .filter(({ entry, setup }) => {
        const setupMatch = matchesSetupFilter(setup, activeSetup);
        const queryMatch = !query ||
          [entry.term, entry.chinese, entry.short, entry.example, entry.category, entry.pdfEnglish, entry.detail]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query));

        return setupMatch && queryMatch;
      });
  }, [activeSetup, glossaryQuery]);

  const activeLesson = visibleLessons.find((lesson) => lesson.id === activeLessonId) ?? visibleLessons[0];
  const activeCase = visibleCases.find((chartCase) => chartCase.id === activeCaseId) ?? visibleCases[0];
  const activeExam = examPool.length ? examPool[activeExamIndex % examPool.length] : undefined;
  const linkedChart = activeExam?.chartCaseId ? chartCases.find((item) => item.id === activeExam.chartCaseId) : undefined;

  const completedLessons = lessons.filter((lesson) => completedSet.has(lesson.id)).length;
  const progressPercent = Math.round((completedLessons / lessons.length) * 100);
  const answeredCount = Object.keys(progress.quizAnswers).length;
  const correctCount = Object.values(progress.quizAnswers).filter(Boolean).length;

  const dashboardLessonCount = visibleLessons.length;
  const dashboardCaseCount = visibleCases.length;
  const dashboardExamCount = exams.filter((exam) => matchesSetupFilter(getExamSetup(exam), activeSetup)).length;

  function resetExamState() {
    setSelectedAnswer("");
    setActiveExamIndex(0);
  }

  function updateSetup(nextSetup: SetupFilter) {
    setActiveSetup(nextSetup);
    resetExamState();

    const nextLessons = getVisibleLessons(nextSetup);
    const nextCases = getVisibleCases(nextSetup);

    if (nextLessons.length) {
      setActiveLessonId((currentId) => (nextLessons.some((lesson) => lesson.id === currentId) ? currentId : nextLessons[0].id));
    }

    if (nextCases.length) {
      setActiveCaseId((currentId) => (nextCases.some((chartCase) => chartCase.id === currentId) ? currentId : nextCases[0].id));
    }
  }

  function answerExam(answer: string) {
    if (!activeExam) return;
    setSelectedAnswer(answer);
    recordQuiz(activeExam.id, answer === activeExam.answer, answer);
  }

  function nextExam() {
    if (!examPool.length) return;
    setSelectedAnswer("");
    setActiveExamIndex((index) => (index + 1) % examPool.length);
  }

  function openCase(caseId: string) {
    const chartCase = chartCases.find((item) => item.id === caseId);
    if (!chartCase) return;

    const nextSetup = getChartCaseSetup(chartCase);
    updateSetup(nextSetup);
    setActiveCaseId(caseId);
    setActiveModule("cases");
  }

  function startExam(mode: ExamQuestion["mode"], lesson?: LessonUnit) {
    setExamMode(mode);

    if (lesson) {
      const lessonSetup = getLessonSetup(lesson);
      updateSetup(lessonSetup === "foundation" ? "foundation" : lessonSetup);
    } else {
      resetExamState();
    }

    setActiveModule("exam");
  }

  function exportLearningRecord() {
    const payload = exportProgress();
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `setup-coach-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function confirmResetProgress() {
    const shouldReset = window.confirm("这会清除本机学习记录。建议先导出学习记录。确定要继续吗？");
    if (shouldReset) {
      resetProgress();
    }
  }

  const progressRecoveryMessage =
    progress.recovery.kind === "memory-only"
      ? `学习记录暂时只保存在内存中：${progress.recovery.reason}`
      : progress.recovery.kind === "recovered"
        ? `学习记录需要恢复：${progress.recovery.reason}`
        : progress.recovery.kind === "write-failed"
          ? `学习记录保存失败：${progress.recovery.reason}`
          : "";

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="主导航">
        <div className="brand">
          <span className="brand-mark">A2</span>
          <div>
            <strong>Setup Coach</strong>
            <small>课程 · 图表 · 考试</small>
          </div>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => (
            <button key={item.id} className={activeModule === item.id ? "active" : ""} onClick={() => setActiveModule(item.id)} type="button">
              {item.label}
            </button>
          ))}
        </nav>
        <div className="progress-panel">
          <span>课程掌握度</span>
          <strong>{progressPercent}%</strong>
          <div className="progress-track"><div style={{ width: `${progressPercent}%` }} /></div>
          <p>{completedLessons}/{lessons.length} 个知识点已完成</p>
          {progressRecoveryMessage && <p className="progress-warning">{progressRecoveryMessage}</p>}
          <div className="mastery-list">
            {(["foundation", "a2", "w1p", "dp", "fbo"] as const).map((setupId) => (
              <span
                key={setupId}
                className={`mastery-pill ${mastery[setupId].status}`}
              >
                {setupMasteryLabels[setupId]} · {masteryStatusLabels[mastery[setupId].status]}
              </span>
            ))}
          </div>
          <button className="text-button" type="button" onClick={exportLearningRecord}>导出学习记录</button>
          <button className="text-button" type="button" onClick={confirmResetProgress}>重置学习记录</button>
        </div>
      </aside>

      <main className="main-content">
        {activeModule === "dashboard" && (
          <section className="screen">
            <div className="dashboard-hero">
              <div>
                <p className="eyebrow">Book-to-practice learning system</p>
                <h1>把《Nine Transitions》变成可训练、可考试、可复盘的 setup 学习系统。</h1>
                <p>
                  每个知识点都包含讲解、判定流程、图表案例、常见误判和考试题。目标是替你完成第一轮“啃书”，
                  让你直接进入结构化学习和看图训练，并逐步扩展到 A2、W1P、DP、fBO。
                </p>
              </div>
              <div className="score-board">
                <span>考试表现</span>
                <strong>{answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0}%</strong>
                <p>正确 {correctCount} / 已答 {answeredCount}</p>
              </div>
            </div>

            <SetupTabs activeSetup={activeSetup} onChange={updateSetup} />
            <div className="setup-summary">
              <strong>{activeSetup === "all" ? "当前视角：All setups" : activeSetup === "foundation" ? "当前视角：Basics" : `当前视角：${activeSetup.toUpperCase()}`}</strong>
              <p>{setupDescriptions[activeSetup]}</p>
            </div>

            <div className="learning-path">
              {learningPath.map((step, index) => (
                <article key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </article>
              ))}
            </div>

            <div className="dashboard-grid">
              <Metric label="知识点" value={dashboardLessonCount.toString()} note={activeSetup === "all" ? "全部课程 + 清单 + 误区" : "当前分类下的课程"} />
              <Metric label="图表案例" value={dashboardCaseCount.toString()} note="每例含 OHLC + EMA + 标注" />
              <Metric label="考试题" value={dashboardExamCount.toString()} note="概念、案例、执行三类" />
              <Metric label="训练闸门" value={simTrainingGates.length.toString()} note="从 SIM 到实盘前验证" />
            </div>
          </section>
        )}

        {activeModule === "course" && (
          <section className="screen">
            <div className="screen-title">
              <p className="eyebrow">Course</p>
              <h2>系统课程</h2>
              <p>不是摘抄书本，而是把每个知识点拆成“为什么、怎么判断、怎么错、怎么考”。</p>
            </div>
            <SetupTabs activeSetup={activeSetup} onChange={updateSetup} />
            <div className="course-layout">
              <aside className="lesson-index">
                <section className="index-group">
                  <h3 className="group-title">{activeSetup === "all" ? "全部课程" : activeSetup === "foundation" ? "Basics" : `${activeSetup.toUpperCase()} 课程`}</h3>
                  {visibleLessons.map((lesson) => (
                    <LessonIndexButton key={lesson.id} lesson={lesson} active={lesson.id === activeLesson?.id} onClick={() => setActiveLessonId(lesson.id)} />
                  ))}
                </section>
              </aside>
              {activeLesson ? (
                <LessonDetail
                  lesson={activeLesson}
                  completed={completedSet.has(activeLesson.id)}
                  onToggle={() => toggleSection(activeLesson.id)}
                  onOpenCase={openCase}
                  onStartExam={(mode) => startExam(mode, activeLesson)}
                />
              ) : (
                <EmptyState message="当前 setup 下没有可显示的课程。" />
              )}
            </div>
          </section>
        )}

        {activeModule === "cases" && (
          <section className="screen">
            <div className="screen-title">
              <p className="eyebrow">Chart lab</p>
              <h2>图表案例库</h2>
              <p>每个案例都给出上下文、任务、判定、逐步读图。你要训练的是流程，不是背答案。</p>
            </div>
            <SetupTabs activeSetup={activeSetup} onChange={updateSetup} />
            <div className="case-layout">
              <aside className="case-index">
                {visibleCases.map((item) => (
                  <button key={item.id} className={item.id === activeCase?.id ? "active" : ""} type="button" onClick={() => setActiveCaseId(item.id)}>
                    <span>{item.setup}</span>
                    <strong>{item.title}</strong>
                  </button>
                ))}
              </aside>
              {activeCase ? <ChartCaseDetail chartCase={activeCase} /> : <EmptyState message="当前 setup 下还没有图表案例。" />}
            </div>
          </section>
        )}

        {activeModule === "exam" && (
          <section className="screen">
            <div className="screen-title">
              <p className="eyebrow">Exam mode</p>
              <h2>学习考试</h2>
              <p>按概念、案例、执行三种模式测试。答错会显示为什么错，不只是给正确答案。</p>
            </div>
            <SetupTabs activeSetup={activeSetup} onChange={updateSetup} />
            <div className="mode-tabs">
              {(["concept", "case", "execution"] as const).map((mode) => (
                <button
                  key={mode}
                  className={examMode === mode ? "active" : ""}
                  type="button"
                  onClick={() => {
                    setExamMode(mode);
                    resetExamState();
                  }}
                >
                  {examModeLabels[mode]}
                </button>
              ))}
            </div>
            <div className="exam-summary">
              <span>{activeSetup === "all" ? "当前 setup：All" : activeSetup === "foundation" ? "当前 setup：Basics" : `当前 setup：${activeSetup.toUpperCase()}`}</span>
              <span>当前模式：{examModeLabels[examMode]}</span>
              <span>题库数量：{examPool.length}</span>
            </div>
            {activeExam ? (
              <ExamCard question={activeExam} chartCase={linkedChart} selectedAnswer={selectedAnswer} onAnswer={answerExam} onNext={nextExam} />
            ) : (
              <EmptyState message="当前 setup 与题型组合下还没有题目。" />
            )}
          </section>
        )}

        {activeModule === "glossary" && (
          <section className="screen">
            <div className="screen-title">
              <p className="eyebrow">Glossary</p>
              <h2>术语表</h2>
              <p>每个术语都配一个图表语境例子，避免只背英文缩写。</p>
            </div>
            <SetupTabs activeSetup={activeSetup} onChange={updateSetup} />
            <input className="search-input" value={glossaryQuery} onChange={(event) => setGlossaryQuery(event.target.value)} placeholder="搜索 A2、W1P、DP、fBO、TTR、信号 K..." />
            <div className="glossary-grid">
              {filteredGlossary.map(({ entry, setup }) => (
                <article className="term-card" key={entry.id}>
                  <div className="term-meta">
                    <span>{entry.category}</span>
                    <em className="setup-badge">{setup === "all" ? "all" : setup.toUpperCase()}</em>
                  </div>
                  <h3>{entry.term}</h3>
                  <strong>{entry.chinese}</strong>
                  {entry.pdfEnglish && <em className="term-english">PDF English: {entry.pdfEnglish}</em>}
                  <p>{entry.short}</p>
                  {entry.detail && <p className="term-detail">{entry.detail}</p>}
                  <small>{entry.example}</small>
                </article>
              ))}
              {!filteredGlossary.length && <p className="empty-state">没有匹配术语。试试切换 setup，或搜索 A2、W1P、DP、fBO、BW、BP、Signal。</p>}
            </div>
          </section>
        )}

        {activeModule === "training" && (
          <section className="screen">
            <div className="screen-title">
              <p className="eyebrow">SIM readiness</p>
              <h2>训练与实盘闸门</h2>
              <p>目标不是学完就实盘，而是先证明自己能在 SIM 中稳定执行已掌握的 setup。所有闸门通过前，只允许回放和模拟。</p>
            </div>
            <TrainingPanel
              rule10={progress.rule10}
              onToggleRule10={toggleRule10}
              examStats={{ answeredCount, correctCount }}
              completedLessons={completedLessons}
            />
          </section>
        )}
      </main>
    </div>
  );
}

function SetupTabs({ activeSetup, onChange }: { activeSetup: SetupFilter; onChange: (setup: SetupFilter) => void }) {
  return (
    <div className="setup-tabs">
      {setupTabs.map((setup) => (
        <button
          key={setup.id}
          className={activeSetup === setup.id ? "active" : ""}
          type="button"
          title={setupDescriptions[setup.id]}
          onClick={() => onChange(setup.id)}
        >
          {setup.label}
        </button>
      ))}
    </div>
  );
}

function LessonIndexButton({ lesson, active, onClick }: { lesson: LessonUnit; active: boolean; onClick: () => void }) {
  return (
    <button className={active ? "active" : ""} type="button" onClick={onClick}>
      <span>{moduleLabels[lesson.module]}</span>
      <strong>{lesson.title}</strong>
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="empty-panel">{message}</div>;
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

type LessonDetailProps = {
  lesson: (typeof lessons)[number];
  completed: boolean;
  onToggle: () => void;
  onOpenCase: (caseId: string) => void;
  onStartExam: (mode: ExamQuestion["mode"]) => void;
};

function LessonDetail({ lesson, completed, onToggle, onOpenCase, onStartExam }: LessonDetailProps) {
  const linkedCases = chartCases.filter((chartCase) => lesson.caseIds.includes(chartCase.id));

  return (
    <article className="lesson-detail">
      <div className="lesson-header">
        <div>
          <span>{moduleLabels[lesson.module]}</span>
          <h2>{lesson.title}</h2>
          <p>{lesson.subtitle}</p>
        </div>
        <button className={completed ? "done-button completed" : "done-button"} type="button" onClick={onToggle}>
          {completed ? "已掌握" : "标记掌握"}
        </button>
      </div>

      <section className="explain-block">
        <h3>掌握目标</h3>
        <p>{lesson.masteryGoal}</p>
      </section>
      <section className="explain-block">
        <h3>为什么重要</h3>
        <p>{lesson.whyItMatters}</p>
      </section>
      <section className="explain-block">
        <h3>讲透这个知识点</h3>
        {lesson.explanation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>

      <div className="split-panels">
        <section>
          <h3>判定流程</h3>
          <ol>
            {lesson.decisionChecklist.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </section>
        <section>
          <h3>常见误判</h3>
          <ul>
            {lesson.commonTraps.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </div>

      <section className="source-note">
        <strong>原书依据</strong>
        <p>{lesson.sourceNote}</p>
      </section>

      {lesson.sourceAnchors?.length ? (
        <section className="source-anchors">
          <h3>PDF 复刻锚点</h3>
          <div>
            {lesson.sourceAnchors.map((anchor) => (
              <article key={anchor.id}>
                <header>
                  <span>{anchor.id}</span>
                  <small>{anchor.source} · {anchor.location}</small>
                </header>
                <strong>{anchor.label}</strong>
                <p>{anchor.rule}</p>
                {anchor.pdfQuote && <em>PDF: {anchor.pdfQuote}</em>}
                {anchor.note && <small>{anchor.note}</small>}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="linked-cases">
        <h3>关联图表案例</h3>
        <div>
          {linkedCases.map((chartCase) => (
            <button key={chartCase.id} type="button" onClick={() => onOpenCase(chartCase.id)}>
              <span>{chartCase.setup}</span>
              <strong>{chartCase.title}</strong>
            </button>
          ))}
        </div>
      </section>

      <div className="lesson-actions">
        <button type="button" onClick={() => onStartExam("concept")}>做概念题</button>
        <button type="button" onClick={() => onStartExam("case")}>做看图题</button>
        <button type="button" onClick={() => onStartExam("execution")}>做执行题</button>
      </div>
    </article>
  );
}

function ChartCaseDetail({ chartCase }: { chartCase: ChartCase }) {
  return (
    <article className="case-detail">
      <div className="case-header">
        <div>
          <span>{chartCase.setup} · 难度 {chartCase.difficulty}</span>
          <h2>{chartCase.title}</h2>
          <p>{chartCase.context}</p>
        </div>
        <strong className={`verdict ${chartCase.kind}`}>{chartCase.kind}</strong>
      </div>
      <CandleChart chartCase={chartCase} />
      <AnnotationLegend chartCase={chartCase} />
      <section className="task-box">
        <strong>你的任务</strong>
        <p>{chartCase.learnerTask}</p>
      </section>
      <section className="verdict-box">
        <strong>判定</strong>
        <p>{chartCase.verdict}</p>
      </section>
      <section className="read-steps">
        <h3>逐步读图</h3>
        <ol>
          {chartCase.detailedRead.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>
    </article>
  );
}

type ExamCardProps = {
  question: ExamQuestion;
  chartCase?: ChartCase;
  selectedAnswer: string;
  onAnswer: (answer: string) => void;
  onNext: () => void;
};

function ExamCard({ question, chartCase, selectedAnswer, onAnswer, onNext }: ExamCardProps) {
  const answered = Boolean(selectedAnswer);
  const wrongReason = selectedAnswer && selectedAnswer !== question.answer ? question.whyWrong[selectedAnswer] : "";

  return (
    <article className="exam-card">
      <div className="quiz-meta">
        <span>{question.mode}</span>
        <span>{lessons.find((lesson) => lesson.id === question.lessonId)?.title}</span>
      </div>
      {chartCase && (
        <>
          <CandleChart chartCase={chartCase} compact />
          <AnnotationLegend chartCase={chartCase} compact />
        </>
      )}
      <h3>{question.prompt}</h3>
      <div className="answer-grid">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = answered && option === question.answer;
          return (
            <button
              key={option}
              className={`${isSelected ? "selected" : ""} ${isCorrect ? "correct" : ""}`}
              type="button"
              onClick={() => onAnswer(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={selectedAnswer === question.answer ? "result-box correct" : "result-box wrong"}>
          <strong>{selectedAnswer === question.answer ? "答对了" : `正确答案：${question.answer}`}</strong>
          <p>{question.explanation}</p>
          {wrongReason && <p><b>你选项的问题：</b>{wrongReason}</p>}
          <button type="button" onClick={onNext}>下一题</button>
        </div>
      )}
    </article>
  );
}

function AnnotationLegend({ chartCase, compact = false }: { chartCase: ChartCase; compact?: boolean }) {
  return (
    <div className={compact ? "annotation-legend compact" : "annotation-legend"}>
      {chartCase.annotations.map((annotation) => (
        <div key={`${chartCase.id}-${annotation.label}-${annotation.barIndex}`}>
          <span className={`legend-number ${annotation.tone}`}>{annotation.label}</span>
          <p>{annotation.text}</p>
        </div>
      ))}
    </div>
  );
}

type TrainingPanelProps = {
  rule10: boolean[];
  onToggleRule10: (index: number) => void;
  examStats: { answeredCount: number; correctCount: number };
  completedLessons: number;
};

function TrainingPanel({ rule10, onToggleRule10, examStats, completedLessons }: TrainingPanelProps) {
  const rule10Progress = rule10.filter(Boolean).length;
  const examScore = examStats.answeredCount ? Math.round((examStats.correctCount / examStats.answeredCount) * 100) : 0;

  return (
    <div className="training-layout">
      <article className="training-card">
        <h3>入场前 10 问</h3>
        <p>每一笔 SIM 交易前都要逐项通过。任何一项失败，都只能标注，不能下单。</p>
        <ol className="checklist-list">
          {preTradeChecklist.map((item) => <li key={item}>{item}</li>)}
        </ol>
      </article>

      <article className="training-card">
        <h3>SIM → 实盘闸门</h3>
        <div className="gate-list">
          {simTrainingGates.map((gate, index) => (
            <section key={gate.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h4>{gate.title}</h4>
              <p>{gate.requirement}</p>
              <small>{gate.evidence}</small>
            </section>
          ))}
        </div>
      </article>

      <article className="training-card">
        <h3>当前状态</h3>
        <div className="readiness-grid">
          <Metric label="课程完成" value={`${completedLessons}/${lessons.length}`} note="必须全部完成" />
          <Metric label="考试正确率" value={`${examScore}%`} note="用于检查理解，不替代 Rule of 10" />
          <Metric label="Rule of 10" value={`${rule10Progress}/5`} note="这里按 5 个里程碑记录" />
        </div>
        <div className="rule10-list">
          {["第 1-2 周达标", "第 3-4 周达标", "第 5-6 周达标", "第 7-8 周达标", "第 9-10 周达标"].map((label, index) => (
            <button key={label} className={rule10[index] ? "checked" : ""} type="button" onClick={() => onToggleRule10(index)}>
              <span>{rule10[index] ? "✓" : "□"}</span>
              {label}
            </button>
          ))}
        </div>
        <section className="source-note">
          <strong>实盘限制</strong>
          <p>未完成 SIM 闸门前，不建议实盘。完成后仍只围绕 PDF 的 E-mini 语境评估，并保留 2/5、wait two swings、每日/每周/月度亏损限制。</p>
        </section>
      </article>
    </div>
  );
}
