import { readFileSync, writeFileSync } from "fs";
import { inferSetupCandidates } from "./classification-rules.mjs";

const manifest = JSON.parse(readFileSync("public/ninetrans-blog/manifest.json", "utf-8"));

let changed = 0;
let totalUncategorized = 0;
let foundationBefore = 0;
let foundationAfter = 0;

for (const post of manifest.posts) {
  const before = JSON.stringify(post.setupCandidates);
  if (post.setupCandidates.includes("foundation")) foundationBefore++;
  post.setupCandidates = inferSetupCandidates(post);
  if (post.setupCandidates.includes("foundation")) foundationAfter++;
  if (post.setupCandidates.length === 1 && post.setupCandidates[0] === "uncategorized") totalUncategorized++;
  if (JSON.stringify(post.setupCandidates) !== before) changed++;
}

writeFileSync("public/ninetrans-blog/manifest.json", JSON.stringify(manifest, null, 2));

console.log(`setupCandidates regenerated: ${changed} posts changed`);
console.log(`foundation: ${foundationBefore} -> ${foundationAfter}`);
console.log(`uncategorized: ${totalUncategorized}`);

const dist = {};
for (const post of manifest.posts) {
  for (const candidate of post.setupCandidates) {
    dist[candidate] = (dist[candidate] || 0) + 1;
  }
}

for (const [setup, count] of Object.entries(dist).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${setup}: ${count}`);
}
