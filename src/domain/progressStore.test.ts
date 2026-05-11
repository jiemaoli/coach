import { describe, expect, it } from "vitest";
import { buildContentIndex } from "./contentIndex";
import { StorageQuotaExceededError, StorageUnavailableError } from "./errors";
import { initialProgress } from "./progressTypes";
import { loadProgress, progressStorageKey, saveProgress, type StorageLike } from "./progressStore";

function memoryStorage(seed?: Record<string, string>): StorageLike {
  const values = new Map(Object.entries(seed ?? {}));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    }
  };
}

const emptyIndex = buildContentIndex({
  lessons: [],
  exams: [],
  chartCases: [],
  examSetupMap: new Map()
});

describe("progressStore", () => {
  it("loads initial progress when storage is empty", () => {
    const result = loadProgress(emptyIndex, memoryStorage());

    expect(result.persistent).toBe(true);
    expect(result.progress).toMatchObject({ schemaVersion: 1, answerAttempts: [] });
  });

  it("quarantines corrupt stored progress", () => {
    const result = loadProgress(emptyIndex, memoryStorage({ [progressStorageKey]: "{bad" }));

    expect(result.quarantinedRaw).toBe("{bad");
    expect(result.progress.recovery.kind).toBe("recovered");
  });

  it("enters memory-only mode when storage read fails", () => {
    const result = loadProgress(emptyIndex, {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => undefined,
      removeItem: () => undefined
    });

    expect(result.persistent).toBe(false);
    expect(result.progress.recovery).toEqual({ kind: "memory-only", reason: "blocked" });
  });

  it("throws a typed quota error when writes exceed quota", () => {
    const storage: StorageLike = {
      getItem: () => null,
      setItem: () => {
        const error = new Error("full");
        error.name = "QuotaExceededError";
        throw error;
      },
      removeItem: () => undefined
    };

    expect(() => saveProgress(initialProgress, storage)).toThrow(StorageQuotaExceededError);
  });

  it("throws storage unavailable for other write failures", () => {
    const storage: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => undefined
    };

    expect(() => saveProgress(initialProgress, storage)).toThrow(StorageUnavailableError);
  });
});
