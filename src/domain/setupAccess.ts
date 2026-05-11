import type { SetupId } from "./setup";

export type SetupFilter = "all" | SetupId;

export const setupLearningOrder: SetupId[] = ["foundation", "a2", "w1p", "dp", "fbo"];

export function matchesSetupFilter(itemSetup: SetupFilter, activeSetup: SetupFilter) {
  if (activeSetup === "all") return true;
  if (activeSetup === "foundation") {
    return itemSetup === "foundation" || itemSetup === "all";
  }

  return itemSetup === activeSetup;
}
