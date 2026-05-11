import { describe, expect, it } from "vitest";
import { a2Lessons, chartCases, examSetupMap, exams, lessons } from "../data/content";
import { buildContentIndex } from "./contentIndex";

describe("actual content index", () => {
  it("builds against the shipped content assets", () => {
    const index = buildContentIndex({ lessons, exams, chartCases, examSetupMap });

    expect(index.lessonsById.size).toBe(lessons.length);
    expect(index.questionsById.size).toBe(exams.length);
    expect(index.casesById.size).toBe(chartCases.length);
  });

  it("keeps A2 lessons tied to concrete PDF replication anchors", () => {
    expect(a2Lessons.length).toBeGreaterThan(0);

    for (const lesson of a2Lessons) {
      expect(lesson.sourceAnchors?.length, `${lesson.id} is missing source anchors`).toBeGreaterThanOrEqual(2);

      for (const anchor of lesson.sourceAnchors ?? []) {
        expect(anchor.source).toMatch(/^ninetrans_book\.(pdf|txt)$/);
        expect(anchor.location, `${lesson.id}/${anchor.id} needs a source location`).toBeTruthy();
        expect(anchor.rule, `${lesson.id}/${anchor.id} needs a replicated rule`).toBeTruthy();
      }
    }
  });
});
