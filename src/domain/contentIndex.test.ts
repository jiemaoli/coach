import { describe, expect, it } from "vitest";
import type { ChartCase, ExamQuestion, LessonUnit } from "../data/content";
import { buildContentIndex } from "./contentIndex";
import { DuplicateContentIdError, EmptyAssessmentBucketError, MissingQuestionMetadataError } from "./errors";

const lesson: LessonUnit = {
  id: "a2-core",
  module: "a2",
  title: "A2 Core",
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
  title: "Case",
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

function question(id: string, mode: ExamQuestion["mode"], chartCaseId?: string): ExamQuestion {
  return {
    id,
    mode,
    lessonId: lesson.id,
    chartCaseId,
    prompt: "What is valid?",
    options: ["A", "B"],
    answer: "A",
    explanation: "A is correct.",
    whyWrong: { B: "Wrong." }
  };
}

function build(overrides: Partial<Parameters<typeof buildContentIndex>[0]> = {}) {
  return buildContentIndex({
    lessons: [lesson],
    chartCases: [chartCase],
    exams: [
      question("q-a2-concept", "concept"),
      question("q-a2-case", "case", chartCase.id),
      question("q-a2-execution", "execution")
    ],
    examSetupMap: new Map([
      ["q-a2-concept", "a2"],
      ["q-a2-case", "a2"],
      ["q-a2-execution", "a2"]
    ]),
    ...overrides
  });
}

describe("buildContentIndex", () => {
  it("builds question metadata by setup and bucket", () => {
    const index = build();

    expect(index.questionMetadataById.get("q-a2-case")).toMatchObject({
      setupId: "a2",
      bucket: "case",
      chartCaseId: chartCase.id,
      version: 1
    });
    expect(index.questionIdsBySetupBucket.get("a2")?.get("execution")).toEqual(["q-a2-execution"]);
  });

  it("fails duplicate ids loudly", () => {
    expect(() => build({ lessons: [lesson, lesson] })).toThrow(DuplicateContentIdError);
  });

  it("fails missing chart case links loudly", () => {
    expect(() => build({ exams: [question("q-a2-case", "case", "missing-case")] })).toThrow(MissingQuestionMetadataError);
  });

  it("fails empty required assessment buckets loudly", () => {
    expect(() => build({ exams: [question("q-a2-concept", "concept")] })).toThrow(EmptyAssessmentBucketError);
  });
});
