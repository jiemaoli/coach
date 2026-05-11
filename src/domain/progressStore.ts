import type { ContentIndex } from "./contentIndex";
import { ProgressParseError, ProgressSchemaError, StorageQuotaExceededError, StorageUnavailableError } from "./errors";
import { initialProgress, type ProgressState } from "./progressTypes";
import { parseStoredProgress } from "./progressMigrations";

export const progressStorageKey = "a2-coach-progress";

export type ProgressLoadResult = {
  progress: ProgressState;
  persistent: boolean;
  quarantinedRaw?: string;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function getStorage(): StorageLike {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new StorageUnavailableError("localStorage is not available");
  }

  return window.localStorage;
}

export function loadProgress(contentIndex: ContentIndex, storage?: StorageLike): ProgressLoadResult {
  const targetStorage = storage ?? getStorage();
  let raw: string | null;
  try {
    raw = targetStorage.getItem(progressStorageKey);
  } catch (error) {
    return {
      progress: { ...initialProgress, recovery: { kind: "memory-only", reason: error instanceof Error ? error.message : "storage read failed" } },
      persistent: false
    };
  }

  if (!raw) {
    return { progress: initialProgress, persistent: true };
  }

  try {
    return { progress: parseStoredProgress(raw, contentIndex), persistent: true };
  } catch (error) {
    if (error instanceof ProgressParseError || error instanceof ProgressSchemaError) {
      return {
        progress: { ...initialProgress, recovery: { kind: "recovered", reason: error.message } },
        persistent: true,
        quarantinedRaw: raw
      };
    }

    throw error;
  }
}

export function saveProgress(progress: ProgressState, storage?: StorageLike): ProgressState {
  const targetStorage = storage ?? getStorage();
  try {
    targetStorage.setItem(progressStorageKey, JSON.stringify(progress));
    return { ...progress, recovery: { kind: "ok" } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "storage write failed";
    const name = error instanceof Error ? error.name : "";
    if (name === "QuotaExceededError") {
      throw new StorageQuotaExceededError(message);
    }

    throw new StorageUnavailableError(message);
  }
}

export function clearProgress(storage?: StorageLike) {
  const targetStorage = storage ?? getStorage();
  targetStorage.removeItem(progressStorageKey);
}
