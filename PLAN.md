# 图片本地化方案

## 目标
将所有 HTML 中的远端图片 src 替换为本地 `images/` 目录下的文件，实现完全离线可读。

## 数据基础

manifest.json 已包含每张图的映射关系：
```json
{
  "url": "https://blogger.googleusercontent.com/.../xxx.png",
  "localPath": "docs/ninetrans-blog/images/xxx.png",
  "filename": "xxx.png"
}
```

## 匹配策略

1. **直接查 manifest** — 488 张图中 428 张可直匹配
2. **归一化尺寸段** — Blogger URL 中的 `/s640/`、`/s400/`、`/s1600/` 等统一为 `/sXXX/` 再查，覆盖剩余 56 张
3. **4 张死图**（无本地文件）：从 HTML 中删除对应 `<div class="separator">` 或替换为 `[图片不可用]`

## 替换规则

- `<img src="远端URL">` → `<img src="images/xxx.png">`
- `<a href="远端URL" imageanchor="1">` 包裹的图片 → 去掉外层 `<a>`，只保留 `<img>`
- `<a href="远端URL">` 内只有 `<br>` 的空锚点 → 直接删除

## 4 张死图

- `http://j.static-locatetv.com/...jpg` — whipsaw 文章的电影海报
- `http://www.tattootalent.com/...jpg` — barb wire 文章的纹身图
- `http://www.vintagemovieposters.co.uk/...jpg` — 某篇文章的老海报
- `http://ia.media-imdb.com/...jpg` — IMDB 的图

## 实施状态

**已完成** — 见 `scripts/replace-images.cjs`

一次性 Node.js 脚本：
1. 读取 manifest.json 构建 URL→localPath 映射（含归一化备选）✅
2. 遍历所有 HTML 文件 ✅
3. 对每个 `<img src>` 执行映射替换 ✅（`images/` → `../images/`）
4. 清理空锚点及 `imageanchor="1"` 外层标签 ✅
5. 无本地副本的图标记或删除 ✅

处理结果：
- `public/ninetrans-blog/posts/` 和 `docs/ninetrans-blog/posts/` 各 436 个 HTML 文件
- 484 张图片从远程 Blogger URL 替换为本地 `../images/` 路径
- 0 张远程图片残留
- 4 张断图（无本地文件）：3 个 `<div class="separator">` 已删除，1 个替换为 `[图片不可用]`
