import { useEffect, useMemo, useState } from "react";

export type ProgressState = {
  completedSections: string[];
  quizAnswers: Record<string, boolean>;
  rule10: boolean[];
};

const storageKey = "a2-coach-progress";

const initialProgress: ProgressState = {
  completedSections: [],
  quizAnswers: {},
  rule10: [false, false, false, false, false]
};

function readProgress(): ProgressState {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return initialProgress;
    const parsed = JSON.parse(stored) as Partial<ProgressState>;
    return {
      completedSections: parsed.completedSections ?? [],
      quizAnswers: parsed.quizAnswers ?? {},
      rule10: parsed.rule10?.length === 5 ? parsed.rule10 : initialProgress.rule10
    };
  } catch {
    return initialProgress;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => readProgress());

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // localStorage can be unavailable in strict browser privacy modes.
    }
  }, [progress]);

  const completedSet = useMemo(() => new Set(progress.completedSections), [progress.completedSections]);

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

  function recordQuiz(questionId: string, correct: boolean) {
    setProgress((current) => ({
      ...current,
      quizAnswers: { ...current.quizAnswers, [questionId]: correct }
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

  return { progress, completedSet, toggleSection, recordQuiz, toggleRule10, resetProgress };
}
