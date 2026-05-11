import type { ProgressState } from "./progressTypes";
import { setupPassCriteria, type AssessmentBucket, type MasteryReasonCode, type MasteryStatus, type SetupId } from "./setup";

export type BucketMasteryStats = {
  attempts: number;
  correct: number;
  accuracy: number;
  requiredAttempts: number;
  requiredAccuracy: number;
};

export type SetupMastery = {
  setupId: SetupId;
  status: MasteryStatus;
  reasons: MasteryReasonCode[];
  bucketStats: Partial<Record<AssessmentBucket, BucketMasteryStats>>;
  hardErrors: number;
};

function getAttemptBuckets(progress: ProgressState, setupId: SetupId) {
  return progress.answerAttempts.filter((attempt) => attempt.setupId === setupId);
}

function computeBucketStats(progress: ProgressState, setupId: SetupId): Partial<Record<AssessmentBucket, BucketMasteryStats>> {
  const criteria = setupPassCriteria[setupId];
  const stats: Partial<Record<AssessmentBucket, BucketMasteryStats>> = {};
  const attempts = getAttemptBuckets(progress, setupId);

  for (const bucket of Object.keys(criteria.minAttemptsByBucket) as AssessmentBucket[]) {
    const bucketAttempts = attempts.filter((attempt) => attempt.bucket === bucket);
    const correct = bucketAttempts.filter((attempt) => attempt.correct).length;
    stats[bucket] = {
      attempts: bucketAttempts.length,
      correct,
      accuracy: bucketAttempts.length ? correct / bucketAttempts.length : 0,
      requiredAttempts: criteria.minAttemptsByBucket[bucket] ?? 0,
      requiredAccuracy: criteria.minAccuracyByBucket[bucket] ?? 0
    };
  }

  return stats;
}

function hasPassed(priorMastery: Partial<Record<SetupId, SetupMastery>>, setupId: SetupId) {
  return priorMastery[setupId]?.status === "passed";
}

export function computeSetupMastery(progress: ProgressState, setupId: SetupId, priorMastery: Partial<Record<SetupId, SetupMastery>> = {}): SetupMastery {
  const criteria = setupPassCriteria[setupId];
  const missingPrerequisite = criteria.prerequisiteSetupIds.find((prerequisite) => !hasPassed(priorMastery, prerequisite));
  const bucketStats = computeBucketStats(progress, setupId);
  const hardErrors = getAttemptBuckets(progress, setupId).filter((attempt) => attempt.hardErrorType).length;

  if (missingPrerequisite) {
    return {
      setupId,
      status: "locked",
      reasons: ["PREREQUISITE_NOT_PASSED"],
      bucketStats,
      hardErrors
    };
  }

  const requiredBuckets = Object.keys(criteria.minAttemptsByBucket) as AssessmentBucket[];
  if (!requiredBuckets.length) {
    return {
      setupId,
      status: "not-assessable",
      reasons: ["NO_ASSESSMENT_ITEMS"],
      bucketStats,
      hardErrors
    };
  }

  const reasons: MasteryReasonCode[] = [];
  for (const bucket of requiredBuckets) {
    const stats = bucketStats[bucket];
    if (!stats || stats.attempts < stats.requiredAttempts) {
      reasons.push("INSUFFICIENT_ATTEMPTS");
    } else if (stats.accuracy < stats.requiredAccuracy) {
      reasons.push("SCORE_BELOW_THRESHOLD");
    }
  }

  if (hardErrors > criteria.maxHardErrors) {
    reasons.push("HARD_ERROR_PRESENT");
  }

  if (!reasons.length) {
    return {
      setupId,
      status: "passed",
      reasons: ["ALL_CRITERIA_MET"],
      bucketStats,
      hardErrors
    };
  }

  const hasAnyAttempt = getAttemptBuckets(progress, setupId).length > 0;
  return {
    setupId,
    status: hasAnyAttempt ? "in-progress" : "available",
    reasons: hasAnyAttempt ? [...new Set(reasons)] : ["READY_TO_START"],
    bucketStats,
    hardErrors
  };
}

export function computeAllMastery(progress: ProgressState): Record<SetupId, SetupMastery> {
  const mastery = {} as Record<SetupId, SetupMastery>;
  const order: SetupId[] = ["foundation", "a2", "w1p", "dp", "fbo"];

  for (const setupId of order) {
    mastery[setupId] = computeSetupMastery(progress, setupId, mastery);
  }

  return mastery;
}
