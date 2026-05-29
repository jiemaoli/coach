import { readFileSync, writeFileSync } from 'fs';

const manifest = JSON.parse(readFileSync('public/ninetrans-blog/manifest.json', 'utf-8'));

// Tag rules based on post ID patterns and categories
const tagRules = {
  // Content type detection
  contentType: (post) => {
    if (post.id.startsWith('nt-page-')) return 'reference';
    if (post.labels?.includes('static-page')) return 'reference';
    // Daily analysis posts have date-based IDs and are in daily-analysis category
    if (/^nt-\d{4}-\d{2}-\d{2}-/.test(post.id)) {
      // Check if it's a series post (theory) based on title patterns
      const title = post.title.toLowerCase();
      if (title.includes('creating a trading system') ||
          title.includes('the hard road') ||
          title.includes("trader's mind") ||
          title.includes('price action basics') ||
          title.includes('channel theory') ||
          title.includes('building blocks')) {
        return 'theory';
      }
      return 'daily';
    }
    return 'meta';
  },

  // Market structure detection
  market: (post) => {
    const text = (post.searchText || '').toLowerCase();
    const title = (post.title || '').toLowerCase();
    const combined = title + ' ' + text;
    
    const tags = [];
    if (combined.includes('trend day') || combined.includes('hard trend') || combined.includes('strong trend')) tags.push('trend');
    if (combined.includes('trading range') || combined.includes('range day')) tags.push('range');
    if (combined.includes('chop') || combined.includes('barb wire') || combined.includes('barbwire')) tags.push('chop');
    if (combined.includes('channel') || combined.includes('spike and channel')) tags.push('channel');
    
    return tags.length > 0 ? tags : ['general'];
  },

  // Setup detection
  setup: (post) => {
    const text = (post.searchText || '').toLowerCase();
    const title = (post.title || '').toLowerCase();
    const combined = title + ' ' + text;
    const candidates = post.setupCandidates || [];
    
    const tags = [];
    if (candidates.includes('a2') || combined.includes(' a2 ') || combined.includes('a2 short') || combined.includes('a2 long')) tags.push('A2');
    if (candidates.includes('w1p') || combined.includes('w1p')) tags.push('W1P');
    if (candidates.includes('dp') || combined.includes('double top') || combined.includes('double bottom')) tags.push('DP');
    if (candidates.includes('fbo') || combined.includes('failed breakout') || combined.includes('fbo')) tags.push('fBO');
    if (combined.includes('1pb') || combined.includes('first pullback')) tags.push('1PB');
    if (combined.includes('1rev') || combined.includes('first reversal')) tags.push('1Rev');
    if (combined.includes(' g2 ') || combined.includes('g2 after')) tags.push('G2');
    if (combined.includes('breakout pullback') || combined.includes(' bp ')) tags.push('BP');
    if (combined.includes('1cbo') || combined.includes('channel breakout')) tags.push('1CBO');
    
    return tags.length > 0 ? tags : ['general'];
  },

  // Topic detection
  topic: (post) => {
    const text = (post.searchText || '').toLowerCase();
    const title = (post.title || '').toLowerCase();
    const combined = title + ' ' + text;
    
    const tags = [];
    if (combined.includes('execution') || combined.includes('entry') || combined.includes('entering')) tags.push('execution');
    if (combined.includes('trade management') || combined.includes('stop') || combined.includes('target') || combined.includes('exit')) tags.push('trade_mgmt');
    if (combined.includes('psychology') || combined.includes('discipline') || combined.includes('emotion') || combined.includes('fear') || combined.includes('greed')) tags.push('psychology');
    if (combined.includes('risk') || combined.includes('loss') || combined.includes('drawdown')) tags.push('risk');
    if (combined.includes('open') || combined.includes('opener') || combined.includes('1pb') || combined.includes('1rev')) tags.push('openers');
    
    return tags.length > 0 ? tags : ['general'];
  },

  // Level detection
  level: (post) => {
    const text = (post.searchText || '').toLowerCase();
    const title = (post.title || '').toLowerCase();
    const combined = title + ' ' + text;
    
    if (combined.includes('beginner') || combined.includes('rank beginner') || combined.includes('rule of ten') || combined.includes('getting started')) return 'beginner';
    if (combined.includes('advanced') || combined.includes('expert') || combined.includes('master')) return 'advanced';
    return 'intermediate';
  }
};

// Apply tags to each post
let tagged = 0;
for (const post of manifest.posts) {
  const normalizedTags = {
    content_type: tagRules.contentType(post),
    market: tagRules.market(post),
    setup: tagRules.setup(post),
    topic: tagRules.topic(post),
    level: tagRules.level(post)
  };
  
  post.normalizedTags = normalizedTags;
  tagged++;
}

// Write updated manifest
writeFileSync('public/ninetrans-blog/manifest.json', JSON.stringify(manifest, null, 2));

// Generate stats
const stats = {
  content_type: {},
  market: {},
  setup: {},
  topic: {},
  level: {}
};

for (const post of manifest.posts) {
  for (const [dim, val] of Object.entries(post.normalizedTags)) {
    const tags = Array.isArray(val) ? val : [val];
    for (const tag of tags) {
      stats[dim][tag] = (stats[dim][tag] || 0) + 1;
    }
  }
}

console.log('=== Multi-Dimensional Tags Generated ===\n');
console.log(`Tagged ${tagged} posts\n`);

for (const [dim, counts] of Object.entries(stats)) {
  console.log(`${dim}:`);
  for (const [tag, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${tag}: ${count}`);
  }
  console.log();
}
