import { readFileSync, writeFileSync } from 'fs';

const manifest = JSON.parse(readFileSync('public/ninetrans-blog/manifest.json', 'utf-8'));

// Label normalization map: lowercase key → normalized value
const LABEL_MAP = {
  'pa basics': 'PA basics',
  'trade management': 'trade management',
  'inside bar': 'inside bar',
  'late entry': 'Late Entry',
  'dojistan': 'doji',
};

function normalizeLabels(labels) {
  if (!labels || labels.length === 0) return labels;
  return labels.map(l => {
    const stripped = l.replace(/^"|"$/g, '');
    const lower = stripped.toLowerCase();
    return LABEL_MAP[lower] || stripped;
  });
}

let labelChanges = 0;
for (const post of manifest.posts) {
  const before = JSON.stringify(post.labels);
  post.labels = normalizeLabels(post.labels);
  if (JSON.stringify(post.labels) !== before) labelChanges++;
}

writeFileSync('public/ninetrans-blog/manifest.json', JSON.stringify(manifest, null, 2));
console.log(`Label normalization: ${labelChanges} posts updated`);

// Show final label distribution
const labelCounts = {};
for (const post of manifest.posts) {
  for (const l of post.labels) {
    labelCounts[l] = (labelCounts[l] || 0) + 1;
  }
}
const sorted = Object.entries(labelCounts).sort((a, b) => b[1] - a[1]);
console.log(`\nUnique labels: ${sorted.length}`);
for (const [label, count] of sorted) {
  console.log(`  ${label}: ${count}`);
}
