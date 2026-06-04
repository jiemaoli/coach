/**
 * 图片本地化替换脚本
 * 
 * 读取 manifest.json 中的 URL→本地文件映射，替换所有 HTML 中的远程图片 src 为本地路径。
 * 保留外层 <a> 标签使图片可点击放大，href 指向本地图片文件。
 * 
 * 处理步骤:
 * 1. 删除包含"死图"URL的整个 .separator div
 * 2. 替换独立的死图为 [图片不可用] 并清理外层 anchor
 * 3. 替换可匹配的 <img src> 为本地路径
 * 4. 更新 imageanchor="1" 锚点的 href 指向本地图片（保留样式和可点击性）
 * 5. 将裸 <img>（不在锚点内）包裹到可点击的 <a> 中
 * 6. 删除空锚点（只有 <br>、&nbsp;、空内容的 <a>）
 * 7. 清理残留的空 .separator div
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// 配置
// ============================================================

const POSTS_DIRS = [
  'public/ninetrans-blog/posts',
  'docs/ninetrans-blog/posts'
];

const MANIFEST_PATH = 'public/ninetrans-blog/manifest.json';

// 死图 URL 前缀（无本地文件）
const DEAD_URL_PREFIXES = [
  'http://j.static-locatetv.com',
  'http://www.tattootalent.com',
  'http://www.vintagemovieposters.co.uk',
  'http://ia.media-imdb.com'
];

// ============================================================
// 构建 URL→本地文件名映射
// ============================================================

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

const urlMap = new Map();

function normalizeSize(url) {
  return url.replace(/\/s\d{2,4}\//, '/sXXX/');
}

let mappedCount = 0;
let skippedCount = 0;

for (const post of manifest.posts) {
  for (const img of (post.images || [])) {
    if (!img.filename) {
      skippedCount++;
      continue;
    }
    const url = img.url;
    const normalized = normalizeSize(url);
    if (!urlMap.has(normalized)) {
      urlMap.set(normalized, img.filename);
      mappedCount++;
    }
    if (!urlMap.has(url)) {
      urlMap.set(url, img.filename);
    }
  }
}

console.log(`URL mapping: ${urlMap.size} entries (${mappedCount} unique, ${skippedCount} skipped)`);

// ============================================================
// 判断 URL 是否为死图
// ============================================================

function isDeadUrl(url) {
  return DEAD_URL_PREFIXES.some(p => url.startsWith(p));
}

// ============================================================
// 处理单个 HTML 文件
// ============================================================

function processHtml(html) {
  let result = html;

  // ----------------------------------------------------------
  // Stage 1: 删除包含死图 URL 的整个 .separator div
  // ----------------------------------------------------------
  result = result.replace(
    /<div\s+class="separator"[^>]*>[\s\S]*?<\/div>/gi,
    (match) => {
      const hasDead = DEAD_URL_PREFIXES.some(p => match.includes(p));
      if (hasDead) {
        return '';
      }
      return match;
    }
  );

  // ----------------------------------------------------------
  // Stage 2: 替换独立的死图（不在 .separator div 中的）
  // ----------------------------------------------------------
  for (const prefix of DEAD_URL_PREFIXES) {
    const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const standaloneDead = new RegExp(
      `<a\\s[^>]*>\\s*<img[^>]*src="${escaped}[^"]*"[^>]*>\\s*<\\/a>`,
      'gi'
    );
    result = result.replace(standaloneDead, '[图片不可用]');
  }

  // ----------------------------------------------------------
  // Stage 3: 替换可匹配的 <img src> 为本地路径
  // ----------------------------------------------------------
  result = result.replace(
    /(<img[^>]*)src="([^"]+)"([^>]*>)/g,
    (match, before, srcUrl, after) => {
      if (isDeadUrl(srcUrl)) {
        return match;
      }
      // 已是本地路径，跳过
      if (srcUrl.startsWith('images/') || srcUrl.startsWith('../images/')) {
        return match;
      }
      const filename = urlMap.get(srcUrl) || urlMap.get(normalizeSize(srcUrl));
      if (filename) {
        return `${before}src="../images/${filename}"${after}`;
      }
      return match;
    }
  );

  // ----------------------------------------------------------
  // Stage 4: 更新 imageanchor="1" 锚点的 href 指向本地图片
  // 保留 <a> 标签的样式属性，移除 imageanchor="1" 属性
  // ----------------------------------------------------------
  result = result.replace(
    /<a\s[^>]*imageanchor="1"[^>]*>(?:\s*<br[^>]*>\s*)*(<img[^>]*src="([^"]+)"[^>]*>)\s*<\/a>/g,
    (match, imgTag, imgSrc) => {
      // 移除 imageanchor="1" 属性，保留其他属性
      let anchorOpen = match.match(/<a\s[^>]*>/)[0];
      anchorOpen = anchorOpen.replace(/\s*imageanchor="1"\s*/g, ' ');
      // 替换 href 为本地图片路径
      anchorOpen = anchorOpen.replace(/\s*href\s*=\s*"[^"]*"/g, '');
      anchorOpen = anchorOpen.replace(/>$/, ` href="${imgSrc}">`);
      // 合并多余空格
      anchorOpen = anchorOpen.replace(/\s+/g, ' ').replace(' >', '>');
      return `${anchorOpen}${imgTag}</a>`;
    }
  );

  // ----------------------------------------------------------
  // Stage 5: 将不在锚点内的 <img> 包裹到可点击的 <a> 中
  // 先保护已在锚点内的图片，再包裹剩余的裸图片
  // ----------------------------------------------------------
  // 保护已有锚点的图片
  const protectedAnchors = new Map();
  let protectId = 0;
  result = result.replace(
    /<a[^>]*>[\s\S]*?<\/a>/g,
    (match) => {
      if (/<img[^>]*src="\.\.\/images\//.test(match)) {
        const key = `\x00PROTECTED_A_${protectId++}\x00`;
        protectedAnchors.set(key, match);
        return key;
      }
      return match;
    }
  );

  // 包裹裸图片
  result = result.replace(
    /<img([^>]*src="\.\.\/images\/([^"]+)"[^>]*)>/g,
    (match, attrs, filename) => {
      return `<a href="../images/${filename}" target="_blank">${match}</a>`;
    }
  );

  // 恢复已保护的锚点
  for (const [key, value] of protectedAnchors) {
    result = result.replace(key, value);
  }

  // ----------------------------------------------------------
  // Stage 6: 删除空锚点
  // ----------------------------------------------------------
  result = result.replace(
    /<a\s[^>]*>\s*<br\s*\/?>\s*<\/a>\s*<br\s*\/?>/gi, ''
  );
  result = result.replace(
    /<a\s[^>]*>\s*<br\s*\/?>\s*<\/a>/gi, ''
  );
  result = result.replace(
    /<a\s[^>]*>\s*<\/a>\s*<br\s*\/?>/gi, ''
  );
  result = result.replace(
    /<a\s[^>]*>\s*<\/a>/g, ''
  );
  result = result.replace(
    /<a\s[^>]*>\s*(?:<br\s*\/?>|&nbsp;|\s)*\s*<\/a>/gi, ''
  );

  // ----------------------------------------------------------
  // Stage 7: 清理残留的空 .separator div
  // ----------------------------------------------------------
  result = result.replace(
    /<div\s+class="separator"[^>]*>\s*(?:<br\s*\/?>\s*)*<\/div>/gi, ''
  );

  return result;
}

// ============================================================
// 执行处理
// ============================================================

let totalChanged = 0;

for (const dir of POSTS_DIRS) {
  if (!fs.existsSync(dir)) {
    console.log(`SKIP: ${dir} not found`);
    continue;
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  console.log(`\nProcessing ${files.length} files in ${dir}`);

  let dirChanged = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf-8');
    const original = html;

    html = processHtml(html);

    if (html !== original) {
      fs.writeFileSync(filePath, html, 'utf-8');
      dirChanged++;
      totalChanged++;
    }
  }

  console.log(`  Changed: ${dirChanged} files`);
}

console.log(`\nDone! Files modified: ${totalChanged}`);
