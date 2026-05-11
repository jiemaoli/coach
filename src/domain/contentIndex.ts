import type { ChartCase, ExamQuestion, LessonUnit } from "../data/content";
import { DuplicateContentIdError, EmptyAssessmentBucketError, MissingQuestionMetadataError } from "./errors";
import { getExamBucket, getLessonSetup, isSetupId, setupPassCriteria, type AssessmentBucket, type SetupId } from "./setup";

export type QuestionMetadata = {
  questionId: string;
  setupId: SetupId;
  bucket: AssessmentBucket;
  lessonId: string;
  chartCaseId?: string;
  version: number;
  hardErrorTypes: string[];
  ruleTraceIds: string[];
};

export type ContentIndex = {
  lessonsById: Map<string, LessonUnit>;
  questionsById: Map<string, ExamQuestion>;
  casesById: Map<string, ChartCase>;
  questionMetadataById: Map<string, QuestionMetadata>;
  questionIdsBySetupBucket: Map<SetupId, Map<AssessmentBucket, string[]>>;
};

export type BuildContentIndexInput = {
  lessons: LessonUnit[];
  exams: ExamQuestion[];
  chartCases: ChartCase[];
  examSetupMap: Map<string, Exclude<SetupId, "foundation">>;
};

const hardErrorMatchers: Array<[string, string]> = [
  ["ttr", "TTR_TRADE"],
  ["bw", "BW_TRADE"],
  ["overlap", "OVERLAP_TRADE"],
  ["single leg", "SINGLE_LEG_A2"],
  ["one leg", "SINGLE_LEG_A2"],
  ["direction", "EXECUTION_DIRECTION"],
  ["stop", "STOP_PLACEMENT"]
];

function assertUniqueIds(items: Array<{ id: string }>, label: string) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) {
      throw new DuplicateContentIdError(`Duplicate ${label} id: ${item.id}`);
    }
    seen.add(item.id);
  }
}

function inferHardErrorTypes(question: ExamQuestion) {
  const text = `${question.prompt} ${question.explanation} ${Object.values(question.whyWrong).join(" ")}`.toLowerCase();
  return hardErrorMatchers.filter(([needle]) => text.includes(needle)).map(([, errorType]) => errorType);
}

function getQuestionSetup(question: ExamQuestion, examSetupMap: Map<string, Exclude<SetupId, "foundation">>, lessonsById: Map<string, LessonUnit>): SetupId {
  const mappedSetup = examSetupMap.get(question.id);
  if (mappedSetup) return mappedSetup;

  const lesson = lessonsById.get(question.lessonId);
  if (!lesson) {
    return "foundation";
  }

  return getLessonSetup(lesson);
}

function addQuestionToBucket(
  bucketMap: Map<SetupId, Map<AssessmentBucket, string[]>>,
  setupId: SetupId,
  bucket: AssessmentBucket,
  questionId: string
) {
  const setupBuckets = bucketMap.get(setupId) ?? new Map<AssessmentBucket, string[]>();
  setupBuckets.set(bucket, [...(setupBuckets.get(bucket) ?? []), questionId]);
  bucketMap.set(setupId, setupBuckets);
}

export function buildContentIndex({ lessons, exams, chartCases, examSetupMap }: BuildContentIndexInput): ContentIndex {
  assertUniqueIds(lessons, "lesson");
  assertUniqueIds(exams, "question");
  assertUniqueIds(chartCases, "chart case");

  const lessonsById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const questionsById = new Map(exams.map((exam) => [exam.id, exam]));
  const casesById = new Map(chartCases.map((chartCase) => [chartCase.id, chartCase]));
  const questionMetadataById = new Map<string, QuestionMetadata>();
  const questionIdsBySetupBucket = new Map<SetupId, Map<AssessmentBucket, string[]>>();

  for (const question of exams) {
    const setupId = getQuestionSetup(question, examSetupMap, lessonsById);
    const bucket = getExamBucket(question);

    if (!isSetupId(setupId) || !question.lessonId || !question.options.length || !question.answer) {
      throw new MissingQuestionMetadataError(`Question ${question.id} is missing required mastery metadata`);
    }

    if (question.chartCaseId && !casesById.has(question.chartCaseId)) {
      throw new MissingQuestionMetadataError(`Question ${question.id} references missing chart case ${question.chartCaseId}`);
    }

    const metadata: QuestionMetadata = {
      questionId: question.id,
      setupId,
      bucket,
      lessonId: question.lessonId,
      chartCaseId: question.chartCaseId,
      version: 1,
      hardErrorTypes: inferHardErrorTypes(question),
      ruleTraceIds: []
    };

    questionMetadataById.set(question.id, metadata);
    addQuestionToBucket(questionIdsBySetupBucket, setupId, bucket, question.id);
  }

  for (const criteria of Object.values(setupPassCriteria)) {
    const setupBuckets = questionIdsBySetupBucket.get(criteria.setupId);
    if (!setupBuckets) continue;

    for (const bucket of Object.keys(criteria.minAttemptsByBucket) as AssessmentBucket[]) {
      if (!setupBuckets.get(bucket)?.length) {
        throw new EmptyAssessmentBucketError(`Setup ${criteria.setupId} has no ${bucket} assessment questions`);
      }
    }
  }

  return {
    lessonsById,
    questionsById,
    casesById,
    questionMetadataById,
    questionIdsBySetupBucket
  };
}
