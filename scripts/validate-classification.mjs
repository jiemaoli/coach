import { readFileSync } from 'fs';

// Read files
const manifest = JSON.parse(readFileSync('public/ninetrans-blog/manifest.json', 'utf-8'));
const appTsx = readFileSync('src/App.tsx', 'utf-8');

// Extract all post IDs from manifest
const manifestIds = new Set(manifest.posts.map(p => p.id));

// Extract studyPath from App.tsx
const studyPathMatch = appTsx.match(/const studyPath: StudyStage\[\] = \[([\s\S]*?)\n\];/);
if (!studyPathMatch) {
  console.error('Could not extract studyPath');
  process.exit(1);
}

// Parse categories
const categoryBlocks = studyPathMatch[1].split(/\{\s*\n\s*id:/).filter(Boolean);
const categories = [];
for (const block of categoryBlocks) {
  const idMatch = block.match(/"([^"]+)"/);
  const titleMatch = block.match(/title:\s*"([^"]+)"/);
  const postIdsMatch = block.match(/postIds:\s*\[([\s\S]*?)\]/);
  
  if (idMatch && titleMatch && postIdsMatch) {
    const postIds = postIdsMatch[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || [];
    categories.push({
      id: idMatch[1],
      title: titleMatch[1],
      postIds
    });
  }
}

console.log('=== Validation Report ===\n');

// 1. Check postCount
console.log(`1. postCount Check:`);
console.log(`   Manifest header: ${manifest.postCount}`);
console.log(`   Actual posts: ${manifest.posts.length}`);
if (manifest.postCount !== manifest.posts.length) {
  console.log(`   ❌ MISMATCH: header says ${manifest.postCount}, actual is ${manifest.posts.length}`);
} else {
  console.log(`   ✓ Match`);
}
console.log();

// 2. Find uncategorized posts
const categorizedIds = new Set();
for (const cat of categories) {
  for (const id of cat.postIds) {
    categorizedIds.add(id);
  }
}

const uncategorized = manifestIds.size - categorizedIds.size;
console.log(`2. Coverage Check:`);
console.log(`   Total posts in manifest: ${manifestIds.size}`);
console.log(`   Posts in categories: ${categorizedIds.size}`);
console.log(`   Uncategorized: ${uncategorized}`);
if (uncategorized > 0) {
  const missing = [...manifestIds].filter(id => !categorizedIds.has(id));
  console.log(`   ❌ Missing posts:`);
  missing.forEach(id => console.log(`      - ${id}`));
} else {
  console.log(`   ✓ All posts categorized`);
}
console.log();

// 3. Check for bad references (ID in category but not in manifest)
console.log(`3. Bad Reference Check:`);
let badRefs = 0;
for (const cat of categories) {
  for (const id of cat.postIds) {
    if (!manifestIds.has(id)) {
      console.log(`   ❌ ${cat.title}: "${id}" not found in manifest`);
      badRefs++;
    }
  }
}
if (badRefs === 0) {
  console.log(`   ✓ No bad references`);
}
console.log();

// 4. Check title counts vs actual counts
console.log(`4. Title Count Check:`);
for (const cat of categories) {
  const titleCountMatch = cat.title.match(/\((\d+)\s*posts?\)/);
  if (titleCountMatch) {
    const titleCount = parseInt(titleCountMatch[1]);
    const actualCount = cat.postIds.length;
    if (titleCount !== actualCount) {
      console.log(`   ❌ "${cat.title}": title says ${titleCount}, actual is ${actualCount}`);
    } else {
      console.log(`   ✓ "${cat.title}": ${actualCount} posts`);
    }
  }
}
console.log();

// 5. Check for duplicate IDs across categories
console.log(`5. Duplicate Check:`);
const idToCategories = new Map();
for (const cat of categories) {
  for (const id of cat.postIds) {
    if (!idToCategories.has(id)) {
      idToCategories.set(id, []);
    }
    idToCategories.get(id).push(cat.title);
  }
}

let duplicates = 0;
for (const [id, cats] of idToCategories) {
  if (cats.length > 1) {
    console.log(`   ❌ "${id}" appears in: ${cats.join(', ')}`);
    duplicates++;
  }
}
if (duplicates === 0) {
  console.log(`   ✓ No duplicates`);
}
console.log();

// 6. Check date format consistency
console.log(`6. Date Format Check:`);
let dateIssues = 0;
for (const cat of categories) {
  for (const id of cat.postIds) {
    if (id.startsWith('nt-page-')) continue; // Skip static pages
    const dateMatch = id.match(/^nt-(\d{4})-(\d{2})-(\d{2})-/);
    if (!dateMatch) {
      console.log(`   ❌ Invalid date format: "${id}"`);
      dateIssues++;
    } else {
      const year = parseInt(dateMatch[1]);
      if (year < 2010 || year > 2020) {
        console.log(`   ⚠️ Suspicious year ${year}: "${id}"`);
        dateIssues++;
      }
    }
  }
}
if (dateIssues === 0) {
  console.log(`   ✓ All dates look valid`);
}
console.log();

// 7. Check labels coverage
console.log(`7. Labels Coverage:`);
const withLabels = manifest.posts.filter(p => p.labels && p.labels.length > 0).length;
const withoutLabels = manifest.posts.length - withLabels;
console.log(`   With labels: ${withLabels} (${((withLabels/manifest.posts.length)*100).toFixed(1)}%)`);
console.log(`   Without labels: ${withoutLabels} (${((withoutLabels/manifest.posts.length)*100).toFixed(1)}%)`);
console.log();

// 8. Check setupCandidates distribution
console.log(`8. setupCandidates Distribution:`);
const setupCounts = {};
for (const post of manifest.posts) {
  for (const sc of (post.setupCandidates || [])) {
    setupCounts[sc] = (setupCounts[sc] || 0) + 1;
  }
}
for (const [setup, count] of Object.entries(setupCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`   ${setup}: ${count} (${((count/manifest.posts.length)*100).toFixed(1)}%)`);
}
console.log();

// Summary
console.log('=== Summary ===');
const issues = [
  manifest.postCount !== manifest.posts.length ? 'postCount mismatch' : null,
  uncategorized > 0 ? `${uncategorized} uncategorized posts` : null,
  badRefs > 0 ? `${badRefs} bad references` : null,
  duplicates > 0 ? `${duplicates} duplicates` : null,
  dateIssues > 0 ? `${dateIssues} date issues` : null,
].filter(Boolean);

if (issues.length === 0) {
  console.log('✓ All checks passed!');
} else {
  console.log(`❌ ${issues.length} issue(s) found:`);
  issues.forEach(i => console.log(`   - ${i}`));
}
