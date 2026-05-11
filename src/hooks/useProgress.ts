import { useEffect, useMemo, useState } from "react";
import { chartCases, examSetupMap, exams, lessons } from "../data/content";
import { buildContentIndex } from "../domain/contentIndex";
import { StorageQuotaExceededError, StorageUnavailableError } from "../domain/errors";
import { computeAllMastery } from "../domain/masteryEngine";
import { getLatestQuizAnswers, initialProgress, type ProgressState } from "../domain/progressTypes";
import { loadProgress, saveProgress } from "../domain/progressStore";

const contentIndex = buildContentIndex({ lessons, exams, chartCases, examSetupMap });

export type ProgressView = ProgressState & {
  quizAnswers: Record<string, boolean>;
};

function toProgressView(progress: ProgressState): ProgressView {
  return {
    ...progress,
    quizAnswers: getLatestQuizAnswers(progress)
  };
}

function readProgress(): ProgressState {
  return loadProgress(contentIndex).progress;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => readProgress());

  useEffect(() => {
    if (progress.recovery.kind === "memory-only" || progress.recovery.kind === "recovered" || progress.recovery.kind === "write-failed") {
      return;
    }

    try {
      saveProgress(progress);
    } catch (error) {
      if (error instanceof StorageUnavailableError || error instanceof StorageQuotaExceededError) {
        setProgress((current) => ({
          ...current,
          recovery: { kind: "write-failed", reason: error.message }
        }));
        return;
      }

      throw error;
    }
  }, [progress]);

  const completedSet = useMemo(() => new Set(progress.completedSections), [progress.completedSections]);
  const progressView = useMemo(() => toProgressView(progress), [progress]);
  const mastery = useMemo(() => computeAllMastery(progress), [progress]);

  function toggleSection(sectionId: string) {
    setProgress((current) => {
      const exists = current.completedSections.includes(sectionId);
      return {
        ...current,
        completedSections: exists
          ? current.completedSections.filter((id) => id !== sectionId)
          : [...current.completedSections, sectionId]
      };
    });
  }

  function recordQuiz(questionId: string, correct: boolean, selectedAnswer = "") {
    setProgress((current) => ({
      ...current,
      answerAttempts: [
        ...current.answerAttempts,
        {
          id: `${questionId}-${Date.now()}-${current.answerAttempts.length}`,
          questionId,
          selectedAnswer,
          correct,
          timestamp: new Date().toISOString(),
          questionVersion: contentIndex.questionMetadataById.get(questionId)?.version ?? 1,
          setupId: contentIndex.questionMetadataById.get(questionId)?.setupId ?? "foundation",
          bucket: contentIndex.questionMetadataById.get(questionId)?.bucket ?? "concept",
          hardErrorType: correct ? undefined : contentIndex.questionMetadataById.get(questionId)?.hardErrorTypes[0]
        }
      ]
    }));
  }

  function toggleRule10(index: number) {
    setProgress((current) => ({
      ...current,
      rule10: current.rule10.map((checked, itemIndex) => (itemIndex === index ? !checked : checked))
    }));
  }

  function resetProgress() {
    setProgress(initialProgress);
  }

  function exportProgress() {
    return JSON.stringify(progress, null, 2);
  }

  return { progress: progressView, mastery, completedSet, toggleSection, recordQuiz, toggleRule10, resetProgress, exportProgress };
}
