from __future__ import annotations

import argparse
import json
from pathlib import Path


def remove_unreferenced(root: Path, dry_run: bool) -> dict[str, int]:
    manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    keep = set()
    for post in manifest.get("posts", []):
        for key in ("htmlPath", "textPath"):
            if post.get(key):
                keep.add(Path(post[key]).resolve())
        for image in post.get("images", []):
            if image.get("localPath"):
                keep.add(Path(image["localPath"]).resolve())

    removed = {"posts": 0, "images": 0}
    for folder, label in ((root / "posts", "posts"), (root / "images", "images")):
        if not folder.exists():
            continue
        for path in folder.iterdir():
            if path.is_file() and path.resolve() not in keep:
                removed[label] += 1
                if not dry_run:
                    path.unlink()
    return removed


def main() -> None:
    parser = argparse.ArgumentParser(description="Remove archived files not referenced by the current manifest.")
    parser.add_argument("--archive", default="docs/ninetrans-blog")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    removed = remove_unreferenced(Path(args.archive), args.dry_run)
    print(json.dumps({"dryRun": args.dry_run, **removed}, indent=2))


if __name__ == "__main__":
    main()
