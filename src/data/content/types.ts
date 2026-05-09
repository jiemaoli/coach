export type ModuleId = "dashboard" | "course" | "cases" | "exam" | "training" | "glossary";

export type LessonModule = "bar" | "a2" | "structure" | "w1p" | "dp" | "fbo" | "risk";

export type LessonUnit = {
  id: string;
  module: LessonModule;
  title: string;
  subtitle: string;
  masteryGoal: string;
  whyItMatters: string;
  explanation: string[];
  decisionChecklist: string[];
  commonTraps: string[];
  sourceNote: string;
  caseIds: string[];
  examIds: string[];
};

export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  label?: string;
  signal?: boolean;
};

export type ChartAnnotation = {
  barIndex: number;
  price: number;
  label: string;
  text: string;
  tone: "good" | "warn" | "bad" | "info";
};

export type ChartCase = {
  id: string;
  title: string;
  kind: "valid" | "skip" | "wait" | "reversal-risk";
  difficulty: 1 | 2 | 3;
  setup: string;
  context: string;
  learnerTask: string;
  verdict: string;
  detailedRead: string[];
  bars: Candle[];
  ema: number[];
  annotations: ChartAnnotation[];
};

export type ExamQuestion = {
  id: string;
  mode: "concept" | "case" | "execution";
  lessonId: string;
  chartCaseId?: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  whyWrong: Record<string, string>;
};

export type GlossaryEntry = {
  id: string;
  term: string;
  chinese: string;
  category: "setup" | "bar" | "structure" | "risk" | "psychology";
  short: string;
  example: string;
  pdfEnglish?: string;
  detail?: string;
};

export type TrainingGate = {
  id: string;
  title: string;
  requirement: string;
  evidence: string;
};
