import type { ExamQuestion } from "../data/content";
import type { ContentIndex } from "./contentIndex";
import { ProgressParseError, ProgressSchemaError } from "./errors";
import { initialProgress, progressSchemaVersion, type LegacyProgressState, type ProgressState } from "./progressTypes";

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeRule10(value: unknown) {
  return Array.isArray(value) && value.length === 5 ? value.map(Boolean) : initialProgress.rule10;
}

function migrateLegacyProgress(parsed: Partial<LegacyProgressState>, contentIndex: ContentIndex): ProgressState {
  const attempts = Object.entries(parsed.quizAnswers ?? {}).map(([questionId, correct], index) => {
    const metadata = contentIndex.questionMetadataById.get(questionId);
    const question = contentIndex.questionsById.get(questionId) as ExamQuestion | undefined;
    return {
      id: `migrated-${questionId}-${index}`,
      questionId,
      selectedAnswer: correct && question ? question.answer : "",
      correct: Boolean(correct),
      timestamp: new Date(0).toISOString(),
      questionVersion: metadata?.version ?? 1,
      setupId: metadata?.setupId ?? "foundation",
      bucket: metadata?.bucket ?? "concept",
      hardErrorType: undefined
    };
  });

  const knownQuestionIds = new Set(contentIndex.questionsById.keys());
  const orphanedQuestionIds = Object.keys(parsed.quizAnswers ?? {}).filter((questionId) => !knownQuestionIds.has(questionId));
  const knownLessonIds = new Set(contentIndex.lessonsById.keys());
  const completedSections = (parsed.completedSections ?? []).filter((sectionId) => knownLessonIds.has(sectionId));
  const orphanedCompletedSections = (parsed.completedSections ?? []).filter((sectionId) => !knownLessonIds.has(sectionId));

  return {
    ...initialProgress,
    completedSections,
    answerAttempts: attempts,
    rule10: normalizeRule10(parsed.rule10),
    orphanedProgress: {
      completedSections: orphanedCompletedSections,
      questionIds: orphanedQuestionIds
    },
    recovery: { kind: "migrated", fromVersion: 0 }
  };
}

export function parseStoredProgress(raw: string, contentIndex: ContentIndex): ProgressState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new ProgressParseError(error instanceof Error ? error.message : "Unable to parse stored progress");
  }

  if (!isObject(parsed)) {
    throw new ProgressSchemaError("Stored progress must be an object");
  }

  if (parsed.schemaVersion === progressSchemaVersion) {
    return {
      ...initialProgress,
      ...(parsed as ProgressState),
      schemaVersion: progressSchemaVersion,
      rule10: normalizeRule10((parsed as ProgressState).rule10),
      recovery: { kind: "ok" }
    };
  }

  if (parsed.schemaVersion === undefined) {
    return migrateLegacyProgress(parsed as Partial<LegacyProgressState>, contentIndex);
  }

  throw new ProgressSchemaError(`Unsupported progress schema version: ${String(parsed.schemaVersion)}`);
}
