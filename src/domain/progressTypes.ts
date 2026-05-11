import type { AssessmentBucket, SetupId } from "./setup";

export const progressSchemaVersion = 1;

export type LegacyProgressState = {
  completedSections: string[];
  quizAnswers: Record<string, boolean>;
  rule10: boolean[];
};

export type AnswerAttempt = {
  id: string;
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
  timestamp: string;
  questionVersion: number;
  setupId: SetupId;
  bucket: AssessmentBucket;
  hardErrorType?: string;
};

export type ProgressRecoveryStatus =
  | { kind: "ok" }
  | { kind: "migrated"; fromVersion: number }
  | { kind: "memory-only"; reason: string }
  | { kind: "recovered"; reason: string }
  | { kind: "write-failed"; reason: string };

export type ProgressState = {
  schemaVersion: typeof progressSchemaVersion;
  completedSections: string[];
  answerAttempts: AnswerAttempt[];
  rule10: boolean[];
  orphanedProgress: {
    completedSections: string[];
    questionIds: string[];
  };
  recovery: ProgressRecoveryStatus;
};

export const initialProgress: ProgressState = {
  schemaVersion: progressSchemaVersion,
  completedSections: [],
  answerAttempts: [],
  rule10: [false, false, false, false, false],
  orphanedProgress: {
    completedSections: [],
    questionIds: []
  },
  recovery: { kind: "ok" }
};

export function getLatestQuizAnswers(progress: ProgressState): Record<string, boolean> {
  return progress.answerAttempts.reduce<Record<string, boolean>>((answers, attempt) => {
    answers[attempt.questionId] = attempt.correct;
    return answers;
  }, {});
}
