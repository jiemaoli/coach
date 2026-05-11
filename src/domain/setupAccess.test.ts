import { describe, expect, it } from "vitest";
import { matchesSetupFilter, setupLearningOrder } from "./setupAccess";

describe("setupAccess", () => {
  it("keeps every setup freely browsable from the all view", () => {
    expect(matchesSetupFilter("foundation", "all")).toBe(true);
    expect(matchesSetupFilter("a2", "all")).toBe(true);
    expect(matchesSetupFilter("w1p", "all")).toBe(true);
    expect(matchesSetupFilter("dp", "all")).toBe(true);
    expect(matchesSetupFilter("fbo", "all")).toBe(true);
  });

  it("keeps foundation focused on basics plus shared content", () => {
    expect(matchesSetupFilter("foundation", "foundation")).toBe(true);
    expect(matchesSetupFilter("all", "foundation")).toBe(true);
    expect(matchesSetupFilter("a2", "foundation")).toBe(false);
  });

  it("filters specific setup views without prerequisite locks", () => {
    expect(matchesSetupFilter("a2", "a2")).toBe(true);
    expect(matchesSetupFilter("w1p", "w1p")).toBe(true);
    expect(matchesSetupFilter("dp", "dp")).toBe(true);
    expect(matchesSetupFilter("fbo", "fbo")).toBe(true);
    expect(matchesSetupFilter("a2", "w1p")).toBe(false);
  });

  it("keeps the recommended learning order as guidance only", () => {
    expect(setupLearningOrder).toEqual(["foundation", "a2", "w1p", "dp", "fbo"]);
  });
});
