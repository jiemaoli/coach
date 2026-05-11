import { describe, expect, it } from "vitest";
import type { ChartCase, ExamQuestion, LessonUnit } from "../data/content";
import { buildContentIndex } from "./contentIndex";
import { ProgressParseError, ProgressSchemaError } from "./errors";
import { parseStoredProgress } from "./progressMigrations";

const lesson: LessonUnit = {
  id: "lesson-a2",
  module: "a2",
  title: "",
  subtitle: "",
  masteryGoal: "",
  whyItMatters: "",
  explanation: [],
  decisionChecklist: [],
  commonTraps: [],
  sourceNote: "",
  caseIds: ["case-a2"],
  examIds: ["q-a2-concept", "q-a2-case", "q-a2-execution"]
};

const chartCase: ChartCase = {
  id: "case-a2",
  title: "",
  kind: "valid",
  difficulty: 1,
  setup: "A2",
  context: "",
  learnerTask: "",
  verdict: "",
  detailedRead: [],
  bars: [{ open: 1, high: 2, low: 0, close: 1 }],
  ema: [1],
  annotations: []
};

function exam(id: string, mode: ExamQuestion["mode"]): ExamQuestion {
  return {
    id,
    mode,
    lessonId: lesson.id,
    prompt: "",
    options: ["A", "B"],
    answer: "A",
    explanation: "",
    whyWrong: { B: "" }
  };
}

const index = buildContentIndex({
  lessons: [lesson],
  chartCases: [chartCase],
  exams: [exam("q-a2-concept", "concept"), exam("q-a2-case", "case"), exam("q-a2-execution", "execution")],
  examSetupMap: new Map([
    ["q-a2-concept", "a2"],
    ["q-a2-case", "a2"],
    ["q-a2-execution", "a2"]
  ])
});

describe("parseStoredProgress", () => {
  it("migrates legacy boolean quiz answers into attempt events", () => {
    const progress = parseStoredProgress(JSON.stringify({
      completedSections: [lesson.id],
      quizAnswers: { "q-a2-concept": true },
      rule10: [true, false, false, false, false]
    }), index);

    expect(progress.schemaVersion).toBe(1);
    expect(progress.answerAttempts).toHaveLength(1);
    expect(progress.answerAttempts[0]).toMatchObject({
      questionId: "q-a2-concept",
      correct: true,
      setupId: "a2",
      bucket: "concept"
    });
    expect(progress.recovery).toEqual({ kind: "migrated", fromVersion: 0 });
  });

  it("preserves orphaned ids during migration", () => {
    const progress = parseStoredProgress(JSON.stringify({
      completedSections: ["missing-lesson"],
      quizAnswers: { "missing-question": false },
      rule10: []
    }), index);

    expect(progress.orphanedProgress.completedSections).toEqual(["missing-lesson"]);
    expect(progress.orphanedProgress.questionIds).toEqual(["missing-question"]);
  });

  it("rejects corrupt JSON with a typed parse error", () => {
    expect(() => parseStoredProgress("{nope", index)).toThrow(ProgressParseError);
  });

  it("rejects unknown schema versions", () => {
    expect(() => parseStoredProgress(JSON.stringify({ schemaVersion: 999 }), index)).toThrow(ProgressSchemaError);
  });
});
