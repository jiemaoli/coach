# Louie Price Action 内容维护流程

Louie 内容独立放在 `public/louie-price-action/`，不和 Nine Transitions 的博客资料混在一起。

当前状态：Louie 资料先作为暂存素材保留，前端入口暂不开放。等后续拿到可靠的现成资料或字幕来源后，再恢复 `/louie` 相关页面。

## 前端入口

- Nine Transitions: `http://127.0.0.1:5173/nt`
- Louie 视频资料: 暂不开放
- Louie 词汇表: 暂不开放

## 目录结构

- `manifest.json`: 视频索引、播放列表、分类目录、笔记状态。
- `videos/<video-id>/transcript.zh.json`: 带时间戳的中文字幕分段。
- `videos/<video-id>/transcript.zh.txt`: 方便人工查看的纯文本字幕。
- `videos/<video-id>/notes.md`: 结构化学习笔记。
- `categories/<category-id>/index.md`: 按主题分类的学习目录。
- `playlists/<playlist-id>/index.md`: 按播放列表生成的目录。
- `vocabulary.md`: Louie 独立词汇表。

## 首次导入价格行为专题

```powershell
python scripts/fetch_youtube_study_source.py --playlist "https://www.youtube.com/watch?v=152osf_ULas&list=PLrCXUGuTXtGIFMUpj_BB6Uoa-xUOYEZDE" --create-note-stubs
```

这会抓取播放列表索引、视频元数据、中文字幕，并为每个视频创建 `notes.md` 模板。当前 YouTube 字幕抓取不稳定，先不要把这条流程作为正式资料导入方式。

## 后续单视频补充

先判断是否已经抓取过：

```powershell
python scripts/fetch_youtube_study_source.py --video "<youtube-url>" --check-only
```

只加入索引和字幕：

```powershell
python scripts/fetch_youtube_study_source.py --video "<youtube-url>"
```

如果这个视频值得总结，创建 `notes.md` 模板并标记为待总结：

```powershell
python scripts/fetch_youtube_study_source.py --video "<youtube-url>" --mark-worth-summarizing
```

## 依赖

脚本依赖 `yt-dlp` 和 `youtube-transcript-api`：

```powershell
python -m pip install yt-dlp youtube-transcript-api
```
