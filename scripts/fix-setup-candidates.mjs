import { readFileSync, writeFileSync } from 'fs';

const manifest = JSON.parse(readFileSync('public/ninetrans-blog/manifest.json', 'utf-8'));

function inferSetupCandidates(post) {
  const text = ((post.searchText || '') + ' ' + (post.title || '')).toLowerCase();
  const candidates = [];
  const rules = {
    a2: ['a2', 'a 2', 'two legged', '2 legged'],
    w1p: ['w1p', '1pb', 'first pullback', 'wedge'],
    dp: ['dp', 'double top', 'double bottom', 'double test'],
    fbo: ['fbo', 'failed breakout', 'final flag'],
    foundation: ['signal bar', 'ema', 'barb wire', 'spike and channel', 'trend from the open', 'trend resumption', 'breakout test'],
    '1rev': ['1rev', 'first reversal'],
  };
  for (const [setup, needles] of Object.entries(rules)) {
    if (needles.some(n => text.includes(n))) {
      candidates.push(setup);
    }
  }
  return candidates.length > 0 ? candidates : ['uncategorized'];
}

let changed = 0;
let totalUncategorized = 0;
let foundationBefore = 0;
let foundationAfter = 0;

for (const post of manifest.posts) {
  const before = JSON.stringify(post.setupCandidates);
  if (post.setupCandidates.includes('foundation')) foundationBefore++;
  post.setupCandidates = inferSetupCandidates(post);
  if (post.setupCandidates.includes('foundation')) foundationAfter++;
  if (post.setupCandidates.length === 1 && post.setupCandidates[0] === 'uncategorized') totalUncategorized++;
  if (JSON.stringify(post.setupCandidates) !== before) changed++;
}

writeFileSync('public/ninetrans-blog/manifest.json', JSON.stringify(manifest, null, 2));

console.log(`setupCandidates regenerated: ${changed} posts changed`);
console.log(`foundation: ${foundationBefore} → ${foundationAfter}`);
console.log(`uncategorized: ${totalUncategorized}`);

// Distribution stats
const dist = {};
for (const post of manifest.posts) {
  for (const sc of post.setupCandidates) {
    dist[sc] = (dist[sc] || 0) + 1;
  }
}
for (const [setup, count] of Object.entries(dist).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${setup}: ${count}`);
}
