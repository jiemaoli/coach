import { readFileSync, writeFileSync } from "fs";
import { generateNormalizedTags } from "./classification-rules.mjs";

const manifest = JSON.parse(readFileSync("public/ninetrans-blog/manifest.json", "utf-8"));

let tagged = 0;
for (const post of manifest.posts) {
  post.normalizedTags = generateNormalizedTags(post);
  tagged++;
}

writeFileSync("public/ninetrans-blog/manifest.json", JSON.stringify(manifest, null, 2));

const stats = {
  content_type: {},
  market: {},
  setup: {},
  topic: {},
  level: {}
};

for (const post of manifest.posts) {
  for (const [dim, value] of Object.entries(post.normalizedTags)) {
    const tags = Array.isArray(value) ? value : [value];
    for (const tag of tags) {
      stats[dim][tag] = (stats[dim][tag] || 0) + 1;
    }
  }
}

console.log("=== Multi-Dimensional Tags Generated ===\n");
console.log(`Tagged ${tagged} posts\n`);

for (const [dim, counts] of Object.entries(stats)) {
  console.log(`${dim}:`);
  for (const [tag, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${tag}: ${count}`);
  }
  console.log();
}
