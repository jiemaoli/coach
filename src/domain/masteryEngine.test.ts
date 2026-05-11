import { describe, expect, it } from "vitest";
import { initialProgress, type AnswerAttempt, type ProgressState } from "./progressTypes";
import { computeAllMastery, computeSetupMastery } from "./masteryEngine";
import type { AssessmentBucket, SetupId } from "./setup";

function attempt(setupId: SetupId, bucket: AssessmentBucket, correct = true, hardErrorType?: string): AnswerAttempt {
  return {
    id: `${setupId}-${bucket}-${Math.random()}`,
    questionId: `${setupId}-${bucket}`,
    selectedAnswer: "A",
    correct,
    timestamp: new Date().toISOString(),
    questionVersion: 1,
    setupId,
    bucket,
    hardErrorType
  };
}

function progress(answerAttempts: AnswerAttempt[]): ProgressState {
  return {
    ...initialProgress,
    answerAttempts
  };
}

describe("masteryEngine", () => {
  it("keeps setup mastery independent from browsing order", () => {
    const mastery = computeSetupMastery(progress([]), "a2");

    expect(mastery.status).toBe("available");
    expect(mastery.reasons).toEqual(["READY_TO_START"]);
  });

  it("marks foundation passed when criteria are met", () => {
    const mastery = computeSetupMastery(progress([
      attempt("foundation", "concept"),
      attempt("foundation", "concept"),
      attempt("foundation", "concept")
    ]), "foundation");

    expect(mastery.status).toBe("passed");
    expect(mastery.reasons).toEqual(["ALL_CRITERIA_MET"]);
  });

  it("does not pass with insufficient attempts", () => {
    const mastery = computeSetupMastery(progress([attempt("foundation", "concept")]), "foundation");

    expect(mastery.status).toBe("in-progress");
    expect(mastery.reasons).toContain("INSUFFICIENT_ATTEMPTS");
  });

  it("does not pass with hard errors despite enough correct answers", () => {
    const attempts = [
      attempt("foundation", "concept"),
      attempt("foundation", "concept"),
      attempt("foundation", "concept"),
      attempt("foundation", "concept", false, "TTR_TRADE")
    ];
    const mastery = computeSetupMastery(progress(attempts), "foundation");

    expect(mastery.status).toBe("in-progress");
    expect(mastery.reasons).toContain("HARD_ERROR_PRESENT");
  });

  it("computes every setup independently", () => {
    const mastery = computeAllMastery(progress([
      attempt("foundation", "concept"),
      attempt("foundation", "concept"),
      attempt("foundation", "concept")
    ]));

    expect(mastery.foundation.status).toBe("passed");
    expect(mastery.a2.status).toBe("available");
    expect(mastery.w1p.status).toBe("available");
    expect(mastery.dp.status).toBe("available");
    expect(mastery.fbo.status).toBe("available");
  });
});
