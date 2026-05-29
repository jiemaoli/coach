import { readFileSync, writeFileSync } from 'fs';

const publicManifest = JSON.parse(readFileSync('public/ninetrans-blog/manifest.json', 'utf-8'));
const docsManifest = JSON.parse(readFileSync('docs/ninetrans-blog/manifest.json', 'utf-8'));

const publicById = new Map(publicManifest.posts.map(p => [p.id, p]));

let synced = 0;
for (const docPost of docsManifest.posts) {
  const pubPost = publicById.get(docPost.id);
  if (pubPost?.normalizedTags) {
    docPost.normalizedTags = pubPost.normalizedTags;
    synced++;
  }
}

writeFileSync('docs/ninetrans-blog/manifest.json', JSON.stringify(docsManifest, null, 2));
console.log(`Synced normalizedTags to docs manifest: ${synced}/${docsManifest.posts.length} posts`);
