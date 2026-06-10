from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


SOURCE_ID = "louie-price-action"
CHANNEL_URL = "https://www.youtube.com/@LouiePriceAction"
DEFAULT_OUT = Path("public/louie-price-action")
DEFAULT_PLAYLIST_ID = "price-action-series"
DEFAULT_PLAYLIST_TITLE = "价格行为专题"
DEFAULT_PLAYLIST_URL = "https://www.youtube.com/watch?v=152osf_ULas&list=PLrCXUGuTXtGIFMUpj_BB6Uoa-xUOYEZDE"
LANGUAGE_PREFERENCES = ["zh-Hans", "zh-CN", "zh", "zh-TW", "zh-Hant", "zh-HK"]

CATEGORY_DEFINITIONS = [
    {
        "id": "foundations",
        "title": "基础框架",
        "description": "价格行为学习的基础认知、框架和方法。",
        "order": 1,
        "tags": ["基础", "概念", "入门", "框架"],
        "keywords": ["基础", "入门", "概念", "原理", "认识", "理解", "框架", "价格行为", "price action", "al brooks"],
    },
    {
        "id": "bars",
        "title": "K线与信号棒",
        "description": "K线、信号棒、入场棒、强弱收盘和影线质量。",
        "order": 2,
        "tags": ["K线", "信号棒", "入场棒", "影线", "强收盘"],
        "keywords": ["k线", "信号棒", "信号bar", "信号 bar", "入场棒", "入场bar", "影线", "尾巴", "收盘", "阳线", "阴线", "doji", "十字星"],
    },
    {
        "id": "trends",
        "title": "趋势与通道",
        "description": "趋势、回调、通道、趋势线和趋势强弱判断。",
        "order": 3,
        "tags": ["趋势", "通道", "趋势线", "回调", "强趋势"],
        "keywords": ["趋势", "通道", "趋势线", "强趋势", "弱趋势", "回调", "均线", "ema", "突破回撤", "spike", "channel"],
    },
    {
        "id": "ranges",
        "title": "交易区间与突破",
        "description": "交易区间、突破、失败突破、突破回撤和震荡行情。",
        "order": 4,
        "tags": ["交易区间", "突破", "失败突破", "震荡", "盘整"],
        "keywords": ["交易区间", "区间", "震荡", "盘整", "突破", "失败突破", "假突破", "突破回撤", "fbo", "bp", "trading range"],
    },
    {
        "id": "reversals",
        "title": "反转与结构形态",
        "description": "反转、楔形、双顶双底、三推和趋势终结结构。",
        "order": 5,
        "tags": ["反转", "楔形", "双顶", "双底", "三推", "趋势终结"],
        "keywords": ["反转", "楔形", "wedge", "双顶", "双底", "三推", "三段", "趋势终结", "高潮", "耗尽", "顶部", "底部"],
    },
    {
        "id": "entries",
        "title": "入场信号",
        "description": "A2、W1P、DP、fBO 等入场逻辑与信号选择。",
        "order": 6,
        "tags": ["入场", "进场", "信号", "A2", "W1P", "DP", "fBO", "1PB"],
        "keywords": ["入场", "进场", "信号", "开仓", "买入", "卖出", "a2", "w1p", "dp", "fbo", "1pb", "1rev", "二次入场", "第二次入场"],
    },
    {
        "id": "management",
        "title": "止损与出场",
        "description": "止损、目标、仓位、加减仓和交易管理。",
        "order": 7,
        "tags": ["止损", "出场", "目标", "仓位", "风控", "管理"],
        "keywords": ["止损", "出场", "目标", "仓位", "风控", "风险", "止盈", "加仓", "减仓", "保本", "持仓", "管理", "scalp", "swing"],
    },
    {
        "id": "live-trading",
        "title": "实盘边做边讲",
        "description": "实盘演示、盘中讲解和边做边讲的视频。",
        "order": 8,
        "tags": ["实盘", "边做边讲", "实战", "盘中", "复盘"],
        "keywords": ["实盘", "边做边讲", "盘中", "复盘", "实战", "交易日", "现场"],
    },
    {
        "id": "psychology",
        "title": "交易心理",
        "description": "耐心、纪律、情绪控制和交易习惯。",
        "order": 9,
        "tags": ["心理", "纪律", "情绪", "耐心", "心态"],
        "keywords": ["心理", "纪律", "心态", "情绪", "耐心", "恐惧", "贪婪", "自律"],
    },
    {
        "id": "misc",
        "title": "其他专题",
        "description": "暂时无法稳定归类的视频。",
        "order": 99,
        "tags": ["其他", "杂项"],
        "keywords": [],
    },
]


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def run_json_command(command: list[str]) -> dict[str, Any]:
    try:
        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
    except FileNotFoundError as error:
        raise RuntimeError("yt-dlp was not found on PATH. Install yt-dlp before running this script.") from error
    except subprocess.CalledProcessError as error:
        details = error.stderr.strip() or error.stdout.strip()
        raise RuntimeError(f"yt-dlp failed: {details}") from error

    return json.loads(result.stdout)


def yt_dlp_base_command() -> list[str]:
    executable = shutil.which("yt-dlp")
    if executable:
        return [executable]
    return [sys.executable, "-m", "yt_dlp"]


def yt_dlp_json(url: str, flat_playlist: bool = False) -> dict[str, Any]:
    command = [*yt_dlp_base_command(), "-J", "--no-warnings"]
    if flat_playlist:
        command.append("--flat-playlist")
    command.append(url)
    return run_json_command(command)


def extract_video_id(value: str) -> str:
    direct = re.fullmatch(r"[A-Za-z0-9_-]{11}", value.strip())
    if direct:
        return value.strip()

    match = re.search(r"(?:v=|youtu\.be/|embed/|shorts/)([A-Za-z0-9_-]{11})", value)
    if match:
        return match.group(1)

    raise ValueError(f"Could not extract YouTube video id from: {value}")


def normalize_date(value: str | None) -> str | None:
    if not value:
        return None
    if re.fullmatch(r"\d{8}", value):
        return f"{value[:4]}-{value[4:6]}-{value[6:8]}"
    return value


def source_relative(path: Path, source_root: Path) -> str:
    return path.relative_to(source_root).as_posix()


def load_manifest(path: Path) -> dict[str, Any]:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))

    return {
        "schemaVersion": 1,
        "sourceId": SOURCE_ID,
        "title": "Louie Price Action",
        "channelUrl": CHANNEL_URL,
        "generatedAt": utc_now(),
        "videoCount": 0,
        "playlists": [
            {
                "id": DEFAULT_PLAYLIST_ID,
                "title": DEFAULT_PLAYLIST_TITLE,
                "url": DEFAULT_PLAYLIST_URL,
                "order": 1,
                "videoIds": [],
            }
        ],
        "categories": [],
        "videos": [],
    }


def manifest_video_by_id(manifest: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {str(video.get("id")): video for video in manifest.get("videos", []) if video.get("id")}


def video_info_from_manifest(video: dict[str, Any]) -> dict[str, Any]:
    video_id = str(video.get("id") or "")
    return {
        "id": video_id,
        "title": str(video.get("title") or video_id),
        "url": str(video.get("url") or f"https://www.youtube.com/watch?v={video_id}"),
        "publishedAt": video.get("publishedAt"),
        "durationSeconds": video.get("durationSeconds"),
    }


def ensure_categories(manifest: dict[str, Any]) -> None:
    existing = {category["id"]: category for category in manifest.get("categories", [])}
    next_categories: list[dict[str, Any]] = []
    known_ids = {definition["id"] for definition in CATEGORY_DEFINITIONS}

    for definition in CATEGORY_DEFINITIONS:
        current = existing.get(definition["id"], {})
        next_categories.append(
            {
                "id": definition["id"],
                "title": current.get("title", definition["title"]),
                "description": current.get("description", definition["description"]),
                "order": current.get("order", definition["order"]),
                "videoIds": current.get("videoIds", []),
                "tags": current.get("tags", definition["tags"]),
            }
        )

    for category in manifest.get("categories", []):
        if category.get("id") not in known_ids:
            category.setdefault("order", 100 + len(next_categories))
            category.setdefault("videoIds", [])
            category.setdefault("tags", [])
            next_categories.append(category)

    manifest["categories"] = sorted(next_categories, key=lambda category: category["order"])


def ensure_playlist(manifest: dict[str, Any], playlist_id: str, title: str, url: str) -> dict[str, Any]:
    playlists = manifest.setdefault("playlists", [])
    for playlist in playlists:
        if playlist["id"] == playlist_id:
            playlist["title"] = playlist.get("title") or title
            playlist["url"] = playlist.get("url") or url
            playlist.setdefault("order", len(playlists) + 1)
            playlist.setdefault("videoIds", [])
            return playlist

    playlist = {
        "id": playlist_id,
        "title": title,
        "url": url,
        "order": len(playlists) + 1,
        "videoIds": [],
    }
    playlists.append(playlist)
    return playlist


def infer_category_ids(title: str, playlist_title: str = "") -> list[str]:
    haystack = f"{title} {playlist_title}".lower()
    matches: list[str] = []

    for definition in CATEGORY_DEFINITIONS:
        if definition["id"] == "misc":
            continue
        for keyword in definition["keywords"]:
            if keyword.lower() in haystack:
                matches.append(definition["id"])
                break

    return matches or ["misc"]


def fetch_transcript(video_id: str) -> tuple[list[dict[str, Any]], str, str, str | None]:
    try:
        from youtube_transcript_api import YouTubeTranscriptApi  # type: ignore
    except ImportError:
        return [], "zh", "unknown", "youtube-transcript-api is not installed"

    errors: list[str] = []

    def normalize(raw_transcript: Any) -> tuple[list[dict[str, Any]], str, str]:
        if hasattr(raw_transcript, "to_raw_data"):
            raw_items = raw_transcript.to_raw_data()
        else:
            raw_items = list(raw_transcript)

        language = getattr(raw_transcript, "language_code", "zh")
        generated = getattr(raw_transcript, "is_generated", None)
        kind = "auto" if generated is True else "manual" if generated is False else "unknown"

        items: list[dict[str, Any]] = []
        for item in raw_items:
            if isinstance(item, dict):
                text = str(item.get("text", "")).strip()
                start = float(item.get("start", 0))
                duration = float(item.get("duration", 0))
            else:
                text = str(getattr(item, "text", "")).strip()
                start = float(getattr(item, "start", 0))
                duration = float(getattr(item, "duration", 0))

            if text:
                items.append({"start": start, "duration": duration, "text": text})

        return items, language, kind

    try:
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id, languages=LANGUAGE_PREFERENCES)
        segments, language, kind = normalize(transcript)
        return segments, language, kind, None
    except Exception as error:  # noqa: BLE001 - older package versions use a different API.
        errors.append(str(error))

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=LANGUAGE_PREFERENCES)
        segments, language, kind = normalize(transcript)
        return segments, language, kind, None
    except Exception as error:  # noqa: BLE001
        errors.append(str(error))

    return [], "zh", "unknown", "; ".join(errors)


def format_seconds(value: float) -> str:
    total = max(0, int(value))
    hours = total // 3600
    minutes = (total % 3600) // 60
    seconds = total % 60
    if hours:
        return f"{hours}:{minutes:02d}:{seconds:02d}"
    return f"{minutes}:{seconds:02d}"


def write_transcript_files(
    source_root: Path,
    video_id: str,
    segments: list[dict[str, Any]],
    error: str | None,
) -> tuple[str, str, str]:
    video_dir = source_root / "videos" / video_id
    video_dir.mkdir(parents=True, exist_ok=True)
    json_path = video_dir / "transcript.zh.json"
    text_path = video_dir / "transcript.zh.txt"

    serialized = json.dumps(segments, ensure_ascii=False, indent=2)
    json_path.write_text(serialized + "\n", encoding="utf-8")

    if segments:
        lines = [f"[{format_seconds(float(segment['start']))}] {segment['text']}" for segment in segments]
    else:
        lines = [f"Transcript unavailable: {error or 'unknown error'}"]

    text_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    digest = hashlib.sha1(serialized.encode("utf-8")).hexdigest()
    return source_relative(json_path, source_root), source_relative(text_path, source_root), digest


def note_state(source_root: Path, video_id: str, previous: dict[str, Any] | None) -> tuple[str | None, str, str]:
    notes_path = source_root / "videos" / video_id / "notes.md"
    if not notes_path.exists():
        return None, "none", "fetched"

    previous_status = (previous or {}).get("notesStatus")
    text = notes_path.read_text(encoding="utf-8")
    if previous_status == "reviewed":
        return source_relative(notes_path, source_root), "reviewed", "reviewed"
    if "待总结" in text:
        return source_relative(notes_path, source_root), "draft", "worth-summarizing"
    return source_relative(notes_path, source_root), "draft", "summarized"


def write_note_stub(source_root: Path, info: dict[str, Any], category_title: str, playlist_title: str) -> None:
    video_dir = source_root / "videos" / info["id"]
    video_dir.mkdir(parents=True, exist_ok=True)
    notes_path = video_dir / "notes.md"
    if notes_path.exists():
        return

    notes_path.write_text(
        f"""# {info['title']}

- 链接: {info['url']}
- 来源: Louie Price Action
- 播放列表: {playlist_title}
- 分类: {category_title}
- 状态: draft

## 学习定位

待总结。本节需要说明这个视频适合解决初学者的哪个价格行为问题。

## 核心观点

待总结。用一到三句话概括本视频最重要的交易理念。

## 关键概念

- 待总结。

## 交易规则

- 待总结。

## 图表与案例

- 待总结。提炼视频中讲到的典型走势、进场、止损、目标和失效条件。

## 初学者注意事项

- 待总结。记录容易误解、容易过度交易或需要先跳过的地方。

## 与 Nine Transitions 体系的关联

- 待总结。

## Louie 特有表达

- 待总结。

## 原文摘录

> 待总结。只保留少量关键短句，避免大段复制字幕。

## 待复核点

- 待复核。
""",
        encoding="utf-8",
    )


def fetch_video_info(video_url: str) -> dict[str, Any]:
    data = yt_dlp_json(video_url)
    video_id = str(data.get("id") or extract_video_id(video_url))
    return {
        "id": video_id,
        "title": str(data.get("title") or video_id),
        "url": str(data.get("webpage_url") or f"https://www.youtube.com/watch?v={video_id}"),
        "publishedAt": normalize_date(data.get("upload_date") or data.get("release_date")),
        "durationSeconds": int(data["duration"]) if data.get("duration") is not None else None,
    }


def upsert_video(
    manifest: dict[str, Any],
    source_root: Path,
    info: dict[str, Any],
    playlist_id: str | None,
    playlist_title: str,
    refresh: bool,
    reclassify: bool,
    create_note_stubs: bool,
) -> str:
    video_by_id = {video["id"]: video for video in manifest.get("videos", [])}
    previous = video_by_id.get(info["id"])
    video_dir = source_root / "videos" / info["id"]
    existing_transcript = bool(
        previous
        and previous.get("transcriptJsonPath")
        and previous.get("transcriptTextPath")
        and (source_root / previous["transcriptJsonPath"]).exists()
        and (source_root / previous["transcriptTextPath"]).exists()
    )
    should_fetch_transcript = refresh or not previous or not existing_transcript
    now = utc_now()

    if should_fetch_transcript:
        segments, language, kind, transcript_error = fetch_transcript(info["id"])
        transcript_json_path, transcript_text_path, transcript_hash = write_transcript_files(
            source_root,
            info["id"],
            segments,
            transcript_error,
        )
    else:
        language = previous.get("transcriptLanguage", "zh")
        kind = previous.get("transcriptKind", "unknown")
        transcript_json_path = previous.get("transcriptJsonPath", f"videos/{info['id']}/transcript.zh.json")
        transcript_text_path = previous.get("transcriptTextPath", f"videos/{info['id']}/transcript.zh.txt")
        transcript_hash = previous.get("transcriptHash", "")

    if previous and not reclassify:
        category_ids = previous.get("categoryIds") or [previous.get("primaryCategoryId") or "misc"]
    else:
        category_ids = infer_category_ids(info["title"], playlist_title)

    primary_category_id = category_ids[0] if category_ids else "misc"
    category_title = next((definition["title"] for definition in CATEGORY_DEFINITIONS if definition["id"] == primary_category_id), primary_category_id)
    if create_note_stubs:
        write_note_stub(source_root, info, category_title, playlist_title)

    notes_path, notes_status, learning_status = note_state(source_root, info["id"], previous)
    playlist_ids = list(dict.fromkeys([*(previous or {}).get("playlistIds", []), *([playlist_id] if playlist_id else [])]))
    tags = list(dict.fromkeys([*category_ids, *(previous or {}).get("tags", [])]))
    title_keywords = [part for part in re.split(r"[\s、,，/|]+", info["title"]) if part]

    video_by_id[info["id"]] = {
        "id": info["id"],
        "sourceId": SOURCE_ID,
        "platform": "youtube",
        "title": info["title"],
        "url": info["url"],
        "publishedAt": info["publishedAt"],
        "durationSeconds": info["durationSeconds"],
        "playlistIds": playlist_ids,
        "primaryCategoryId": primary_category_id,
        "categoryIds": category_ids,
        "transcriptLanguage": language,
        "transcriptKind": kind,
        "transcriptJsonPath": transcript_json_path,
        "transcriptTextPath": transcript_text_path,
        "transcriptHash": transcript_hash,
        "notesPath": notes_path,
        "notesStatus": notes_status,
        "learningStatus": learning_status,
        "tags": tags,
        "titleKeywords": title_keywords[:12],
        "fetchedAt": (previous or {}).get("fetchedAt", now),
        "updatedAt": now,
    }

    video_dir.mkdir(parents=True, exist_ok=True)
    manifest["videos"] = list(video_by_id.values())
    return "updated" if previous else "added"


def sync_manifest_indexes(manifest: dict[str, Any]) -> None:
    videos = manifest.get("videos", [])
    playlist_by_id = {playlist["id"]: playlist for playlist in manifest.get("playlists", [])}
    category_by_id = {category["id"]: category for category in manifest.get("categories", [])}

    for playlist in playlist_by_id.values():
        playlist["videoIds"] = []
    for category in category_by_id.values():
        category["videoIds"] = []

    for video in videos:
        for playlist_id in video.get("playlistIds", []):
            if playlist_id in playlist_by_id and video["id"] not in playlist_by_id[playlist_id]["videoIds"]:
                playlist_by_id[playlist_id]["videoIds"].append(video["id"])

        category_ids = video.get("categoryIds") or [video.get("primaryCategoryId", "misc")]
        for category_id in category_ids:
            target = category_by_id.get(category_id) or category_by_id.get("misc")
            if target and video["id"] not in target["videoIds"]:
                target["videoIds"].append(video["id"])

    manifest["videoCount"] = len(videos)
    manifest["generatedAt"] = utc_now()


def markdown_video_row(video: dict[str, Any], link_prefix: str) -> str:
    title = str(video.get("title") or video.get("id"))
    notes_path = video.get("notesPath")
    target = f"{link_prefix}{notes_path}" if notes_path else str(video.get("url"))
    published = video.get("publishedAt") or "未知日期"
    duration = format_seconds(float(video["durationSeconds"])) if video.get("durationSeconds") is not None else "未知时长"
    status = video.get("notesStatus") or "none"
    return f"- [{title}]({target}) - {published} - {duration} - {status}"


def write_markdown_indexes(manifest: dict[str, Any], source_root: Path) -> None:
    video_by_id = {video["id"]: video for video in manifest.get("videos", [])}
    category_rows = []
    for category in manifest.get("categories", []):
        count = len(category.get("videoIds", []))
        category_rows.append(f"- [{category['title']}](categories/{category['id']}/index.md) - {count} 个视频")

    playlist_rows = []
    for playlist in manifest.get("playlists", []):
        count = len(playlist.get("videoIds", []))
        playlist_rows.append(f"- [{playlist['title']}](playlists/{playlist['id']}/index.md) - {count} 个视频")

    source_index = [
        "# Louie Price Action 学习目录",
        "",
        "这个目录独立于 Nine Transitions，用来沉淀 Louie 中文视频中的价格行为学习资料。",
        "",
        f"视频数量: {manifest.get('videoCount', 0)}",
        f"更新时间: {manifest.get('generatedAt', '')}",
        "",
        "## 分类目录",
        "",
        *(category_rows or ["暂无分类。"]),
        "",
        "## 播放列表",
        "",
        *(playlist_rows or ["暂无播放列表。"]),
        "",
        "## 后续导入",
        "",
        "- 专题播放列表: `python scripts/fetch_youtube_study_source.py --playlist <url> --create-note-stubs`",
        "- 单个补充视频: `python scripts/fetch_youtube_study_source.py --video <url>`",
        "- 判断是否已抓取: `python scripts/fetch_youtube_study_source.py --video <url> --check-only`",
        "- 标记值得总结: `python scripts/fetch_youtube_study_source.py --video <url> --mark-worth-summarizing`",
        "",
    ]
    (source_root / "index.md").write_text("\n".join(source_index), encoding="utf-8")

    categories_root = source_root / "categories"
    categories_root.mkdir(parents=True, exist_ok=True)
    for category in manifest.get("categories", []):
        category_dir = categories_root / category["id"]
        category_dir.mkdir(parents=True, exist_ok=True)
        rows = []
        for video_id in category.get("videoIds", []):
            video = video_by_id.get(video_id)
            if not video:
                continue
            rows.append(markdown_video_row(video, "../../"))
        content = [
            f"# {category['title']}",
            "",
            category["description"],
            "",
            f"标签: {', '.join(category.get('tags', []))}",
            "",
            f"视频数量: {len(category.get('videoIds', []))}",
            "",
            "## 视频",
            "",
            *(rows or ["暂无视频。"]),
            "",
        ]
        (category_dir / "index.md").write_text("\n".join(content), encoding="utf-8")

    playlists_root = source_root / "playlists"
    playlists_root.mkdir(parents=True, exist_ok=True)
    for playlist in manifest.get("playlists", []):
        playlist_dir = playlists_root / playlist["id"]
        playlist_dir.mkdir(parents=True, exist_ok=True)
        rows = []
        for video_id in playlist.get("videoIds", []):
            video = video_by_id.get(video_id)
            if not video:
                continue
            rows.append(markdown_video_row(video, "../../"))
        content = [
            f"# {playlist['title']}",
            "",
            playlist["url"],
            "",
            f"视频数量: {len(playlist.get('videoIds', []))}",
            "",
            "## 视频",
            "",
            *(rows or ["暂无视频。"]),
            "",
        ]
        (playlist_dir / "index.md").write_text("\n".join(content), encoding="utf-8")


def save_manifest(manifest: dict[str, Any], source_root: Path) -> None:
    manifest_path = source_root / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def import_playlist(args: argparse.Namespace, manifest: dict[str, Any], source_root: Path) -> None:
    playlist_data = yt_dlp_json(args.playlist, flat_playlist=True)
    playlist_title = args.playlist_title or playlist_data.get("title") or DEFAULT_PLAYLIST_TITLE
    playlist = ensure_playlist(manifest, args.playlist_id, playlist_title, args.playlist)
    entries = [entry for entry in playlist_data.get("entries", []) if entry and entry.get("id")]
    if args.max_videos:
        entries = entries[: args.max_videos]

    for entry in entries:
        video_id = str(entry["id"])
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        info = fetch_video_info(video_url)
        status = upsert_video(
            manifest,
            source_root,
            info,
            playlist["id"],
            playlist_title,
            args.refresh,
            args.reclassify,
            args.create_note_stubs or args.mark_worth_summarizing,
        )
        print(f"{status}: {video_id} {info['title']}")


def import_videos(args: argparse.Namespace, manifest: dict[str, Any], source_root: Path) -> None:
    if args.manual_playlist_id:
        ensure_playlist(manifest, args.manual_playlist_id, args.manual_playlist_title, "manual")

    existing_by_id = manifest_video_by_id(manifest)
    for video_value in args.video:
        video_id = extract_video_id(video_value)
        existing = existing_by_id.get(video_id)
        if existing and not args.refresh:
            info = video_info_from_manifest(existing)
        else:
            info = fetch_video_info(f"https://www.youtube.com/watch?v={video_id}")

        status = upsert_video(
            manifest,
            source_root,
            info,
            args.manual_playlist_id,
            args.manual_playlist_title,
            args.refresh,
            args.reclassify,
            args.create_note_stubs or args.mark_worth_summarizing,
        )
        if existing and not args.refresh and status == "updated" and not (args.create_note_stubs or args.mark_worth_summarizing or args.reclassify):
            status = "exists"
        print(f"{status}: {video_id} {info['title']}")


def check_videos(args: argparse.Namespace, manifest: dict[str, Any]) -> None:
    existing_by_id = manifest_video_by_id(manifest)
    for video_value in args.video:
        video_id = extract_video_id(video_value)
        existing = existing_by_id.get(video_id)
        if existing:
            notes_status = existing.get("notesStatus", "none")
            transcript_path = existing.get("transcriptTextPath", "")
            print(f"exists: {video_id} {existing.get('title', '')} notes={notes_status} transcript={transcript_path}")
        else:
            print(f"missing: {video_id}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch Louie Price Action YouTube metadata and Chinese transcripts.")
    parser.add_argument("--playlist", default=None, help="YouTube playlist URL. Defaults to Louie's price action playlist when no --video is passed.")
    parser.add_argument("--playlist-id", default=DEFAULT_PLAYLIST_ID)
    parser.add_argument("--playlist-title", default=DEFAULT_PLAYLIST_TITLE)
    parser.add_argument("--video", action="append", default=[], help="Single YouTube video URL or id. Can be passed multiple times.")
    parser.add_argument("--manual-playlist-id", default="manual", help="Optional playlist bucket for single-video imports.")
    parser.add_argument("--manual-playlist-title", default="单独补充")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--refresh", action="store_true", help="Re-fetch transcript and metadata even when the video already exists.")
    parser.add_argument("--reclassify", action="store_true", help="Re-run title-based category inference for existing videos.")
    parser.add_argument("--create-note-stubs", action="store_true", help="Create notes.md templates for imported videos when missing.")
    parser.add_argument("--mark-worth-summarizing", action="store_true", help="Create a notes.md template and mark imported videos as ready for summarization.")
    parser.add_argument("--check-only", action="store_true", help="Only report whether --video ids already exist in the manifest; do not fetch or write files.")
    parser.add_argument("--max-videos", type=int, default=None, help="Limit playlist import count for smoke testing.")
    args = parser.parse_args()

    if args.check_only and not args.video:
        parser.error("--check-only requires at least one --video")

    if not args.playlist and not args.video:
        args.playlist = DEFAULT_PLAYLIST_URL

    source_root = args.out
    source_root.mkdir(parents=True, exist_ok=True)
    manifest = load_manifest(source_root / "manifest.json")
    ensure_categories(manifest)

    if args.check_only:
        check_videos(args, manifest)
        return

    if args.playlist:
        import_playlist(args, manifest, source_root)
    if args.video:
        import_videos(args, manifest, source_root)

    sync_manifest_indexes(manifest)
    write_markdown_indexes(manifest, source_root)
    save_manifest(manifest, source_root)
    print(f"wrote {source_root / 'manifest.json'} ({manifest['videoCount']} videos)")


if __name__ == "__main__":
    main()
