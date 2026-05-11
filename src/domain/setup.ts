import type { ExamQuestion, LessonModule, LessonUnit } from "../data/content";

export type SetupId = "foundation" | "a2" | "w1p" | "dp" | "fbo";

export type AssessmentBucket =
  | "concept"
  | "case"
  | "execution"
  | "failure";

export type MasteryStatus = "locked" | "available" | "in-progress" | "passed" | "needs-review" | "not-assessable";

export type MasteryReasonCode =
  | "PREREQUISITE_NOT_PASSED"
  | "NO_ASSESSMENT_ITEMS"
  | "INSUFFICIENT_ATTEMPTS"
  | "SCORE_BELOW_THRESHOLD"
  | "HARD_ERROR_PRESENT"
  | "ALL_CRITERIA_MET"
  | "READY_TO_START";

export type SetupPassCriteria = {
  setupId: SetupId;
  prerequisiteSetupIds: SetupId[];
  minAttemptsByBucket: Partial<Record<AssessmentBucket, number>>;
  minAccuracyByBucket: Partial<Record<AssessmentBucket, number>>;
  maxHardErrors: number;
};

const foundationModules = new Set<LessonModule>(["bar", "structure", "risk"]);

export const setupPassCriteria: Record<SetupId, SetupPassCriteria> = {
  foundation: {
    setupId: "foundation",
    prerequisiteSetupIds: [],
    minAttemptsByBucket: { concept: 3 },
    minAccuracyByBucket: { concept: 0.8 },
    maxHardErrors: 0
  },
  a2: {
    setupId: "a2",
    prerequisiteSetupIds: [],
    minAttemptsByBucket: { concept: 10, case: 10, execution: 8 },
    minAccuracyByBucket: { concept: 0.85, case: 0.85, execution: 0.9 },
    maxHardErrors: 1
  },
  w1p: {
    setupId: "w1p",
    prerequisiteSetupIds: [],
    minAttemptsByBucket: { concept: 8, case: 8, execution: 6 },
    minAccuracyByBucket: { concept: 0.85, case: 0.85, execution: 0.9 },
    maxHardErrors: 1
  },
  dp: {
    setupId: "dp",
    prerequisiteSetupIds: [],
    minAttemptsByBucket: { concept: 8, case: 8, execution: 6 },
    minAccuracyByBucket: { concept: 0.85, case: 0.85, execution: 0.9 },
    maxHardErrors: 1
  },
  fbo: {
    setupId: "fbo",
    prerequisiteSetupIds: [],
    minAttemptsByBucket: { concept: 8, case: 8, execution: 6 },
    minAccuracyByBucket: { concept: 0.85, case: 0.85, execution: 0.9 },
    maxHardErrors: 1
  }
};

export function getLessonSetup(lesson: LessonUnit): SetupId {
  if (foundationModules.has(lesson.module)) return "foundation";
  if (lesson.module === "a2" || lesson.module === "w1p" || lesson.module === "dp" || lesson.module === "fbo") {
    return lesson.module;
  }

  return "foundation";
}

export function getExamBucket(question: ExamQuestion): AssessmentBucket {
  return question.mode;
}

export function isSetupId(value: string): value is SetupId {
  return value === "foundation" || value === "a2" || value === "w1p" || value === "dp" || value === "fbo";
}
