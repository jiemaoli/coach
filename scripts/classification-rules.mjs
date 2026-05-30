import { readFileSync } from "fs";

const rulesPath = new URL("./classification_rules.json", import.meta.url);

export const classificationRules = JSON.parse(readFileSync(rulesPath, "utf-8"));

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function buildCombinedText(post) {
  return `${normalizeText(post.title)} ${normalizeText(post.searchText)}`.trim();
}

function matchesAny(text, needles = []) {
  return needles.some((needle) => text.includes(needle));
}

export function inferSetupCandidates(input) {
  const text = typeof input === "string" ? normalizeText(input) : buildCombinedText(input);
  const candidates = [];

  for (const [setup, needles] of Object.entries(classificationRules.setupCandidates)) {
    if (matchesAny(text, needles)) {
      candidates.push(setup);
    }
  }

  return candidates.length > 0 ? candidates : ["uncategorized"];
}

export function generateNormalizedTags(post) {
  const combined = buildCombinedText(post);
  const labels = post.labels || [];
  const candidates = post.setupCandidates || [];

  let contentType = classificationRules.defaults.content_type;
  if (post.id?.startsWith("nt-page-") || labels.includes("static-page")) {
    contentType = "reference";
  } else if (/^nt-\d{4}-\d{2}-\d{2}-/.test(post.id || "")) {
    contentType = matchesAny(normalizeText(post.title), classificationRules.contentType.seriesKeywords)
      ? "theory"
      : "daily";
  }

  const market = Object.entries(classificationRules.normalizedTags.market)
    .filter(([, needles]) => matchesAny(combined, needles))
    .map(([tag]) => tag);

  const setup = Object.entries(classificationRules.normalizedTags.setup)
    .filter(([, config]) => {
      const candidateMatch = (config.candidates || []).some((candidate) => candidates.includes(candidate));
      return candidateMatch || matchesAny(combined, config.needles || []);
    })
    .map(([tag]) => tag);

  const topic = Object.entries(classificationRules.normalizedTags.topic)
    .filter(([, needles]) => matchesAny(combined, needles))
    .map(([tag]) => tag);

  let level = classificationRules.defaults.level;
  if (matchesAny(combined, classificationRules.normalizedTags.level.beginner)) {
    level = "beginner";
  } else if (matchesAny(combined, classificationRules.normalizedTags.level.advanced)) {
    level = "advanced";
  }

  return {
    content_type: contentType,
    market: market.length > 0 ? market : [classificationRules.defaults.market],
    setup: setup.length > 0 ? setup : [classificationRules.defaults.setup],
    topic: topic.length > 0 ? topic : [classificationRules.defaults.topic],
    level,
  };
}
