from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


DEFAULT_MANIFEST = Path("public/louie-price-action/manifest.json")


def rel_exists(root: Path, value: str | None) -> bool:
    return bool(value) and (root / value).exists()


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate Louie Price Action manifest consistency.")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    args = parser.parse_args()

    manifest_path = args.manifest
    source_root = manifest_path.parent
    errors: list[str] = []
    warnings: list[str] = []

    if not manifest_path.exists():
        print(f"missing manifest: {manifest_path}", file=sys.stderr)
        raise SystemExit(1)

    manifest: dict[str, Any] = json.loads(manifest_path.read_text(encoding="utf-8"))
    videos = manifest.get("videos", [])
    playlists = manifest.get("playlists", [])
    categories = manifest.get("categories", [])

    if manifest.get("sourceId") != "louie-price-action":
        errors.append("sourceId must be louie-price-action")

    if manifest.get("videoCount") != len(videos):
        errors.append(f"videoCount says {manifest.get('videoCount')}, actual {len(videos)}")

    ids = [video.get("id") for video in videos]
    duplicate_ids = sorted({video_id for video_id in ids if ids.count(video_id) > 1})
    for video_id in duplicate_ids:
        errors.append(f"duplicate video id: {video_id}")

    video_by_id = {video.get("id"): video for video in videos}
    playlist_ids = {playlist.get("id") for playlist in playlists}
    category_ids = {category.get("id") for category in categories}

    for playlist in playlists:
        for video_id in playlist.get("videoIds", []):
            if video_id not in video_by_id:
                errors.append(f"playlist {playlist.get('id')} references missing video {video_id}")

    for category in categories:
        for video_id in category.get("videoIds", []):
            if video_id not in video_by_id:
                errors.append(f"category {category.get('id')} references missing video {video_id}")

    for video in videos:
        video_id = video.get("id")
        if not video_id:
            errors.append("video without id")
            continue

        if not rel_exists(source_root, video.get("transcriptJsonPath")):
            errors.append(f"{video_id}: missing transcriptJsonPath {video.get('transcriptJsonPath')}")
        if not rel_exists(source_root, video.get("transcriptTextPath")):
            errors.append(f"{video_id}: missing transcriptTextPath {video.get('transcriptTextPath')}")

        notes_path = video.get("notesPath")
        notes_status = video.get("notesStatus")
        if notes_path and not rel_exists(source_root, notes_path):
            errors.append(f"{video_id}: notesPath is set but file is missing: {notes_path}")
        if notes_status != "none" and not notes_path:
            errors.append(f"{video_id}: notesStatus={notes_status} but notesPath is empty")

        for playlist_id in video.get("playlistIds", []):
            if playlist_id not in playlist_ids:
                errors.append(f"{video_id}: references missing playlist {playlist_id}")

        category_values = video.get("categoryIds") or [video.get("primaryCategoryId")]
        for category_id in category_values:
            if category_id not in category_ids:
                errors.append(f"{video_id}: references missing category {category_id}")

        primary = video.get("primaryCategoryId")
        if primary and primary not in category_values:
            warnings.append(f"{video_id}: primaryCategoryId is not included in categoryIds")

    for category in categories:
        expected = {
            video["id"]
            for video in videos
            if category["id"] in (video.get("categoryIds") or [video.get("primaryCategoryId")])
        }
        actual = set(category.get("videoIds", []))
        if expected != actual:
            warnings.append(f"category {category.get('id')} videoIds out of sync")

    for playlist in playlists:
        expected = {video["id"] for video in videos if playlist["id"] in video.get("playlistIds", [])}
        actual = set(playlist.get("videoIds", []))
        if expected != actual:
            warnings.append(f"playlist {playlist.get('id')} videoIds out of sync")

    for warning in warnings:
        print(f"warning: {warning}")

    if errors:
        for error in errors:
            print(f"error: {error}", file=sys.stderr)
        raise SystemExit(1)

    print(f"ok: {len(videos)} videos, {len(playlists)} playlists, {len(categories)} categories")


if __name__ == "__main__":
    main()
