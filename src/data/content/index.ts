export { chartCases as a2ChartCases, exams as a2Exams, glossary as a2Glossary, lessons as a2Lessons } from "./a2";
export { dpChartCases, dpExams, dpGlossary, dpLessons } from "./dp";
export { fboChartCases, fboExams, fboGlossary, fboLessons } from "./fbo";
export { learningPath, preTradeChecklist, simTrainingGates } from "./shared";
export * from "./types";
export { w1pChartCases, w1pExams, w1pGlossary, w1pLessons } from "./w1p";

import { chartCases as a2ChartCases, exams as a2Exams, glossary as a2Glossary, lessons as a2Lessons } from "./a2";
import { basicsExams } from "./basics";
import { dpChartCases, dpExams, dpGlossary, dpLessons } from "./dp";
import { fboChartCases, fboExams, fboGlossary, fboLessons } from "./fbo";
import { w1pChartCases, w1pExams, w1pGlossary, w1pLessons } from "./w1p";

export const lessons = [...a2Lessons, ...w1pLessons, ...dpLessons, ...fboLessons];
export const chartCases = [...a2ChartCases, ...w1pChartCases, ...dpChartCases, ...fboChartCases];
export const exams = [...basicsExams, ...a2Exams, ...w1pExams, ...dpExams, ...fboExams];
export const glossary = [...a2Glossary, ...w1pGlossary, ...dpGlossary, ...fboGlossary];

export const examSetupMap = new Map<string, "a2" | "w1p" | "dp" | "fbo">(
  [
    ...a2Exams.map((e) => [e.id, "a2"] as const),
    ...w1pExams.map((e) => [e.id, "w1p"] as const),
    ...dpExams.map((e) => [e.id, "dp"] as const),
    ...fboExams.map((e) => [e.id, "fbo"] as const),
  ]
);