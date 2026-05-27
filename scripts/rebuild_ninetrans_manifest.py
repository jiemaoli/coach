from __future__ import annotations

import json
import re
import html as html_lib
from pathlib import Path


ARCHIVE = Path("docs/ninetrans-blog")
STATIC_PAGE_URLS = {
    "page-glossary": "https://ninetrans.blogspot.com/p/glossary.html",
    "page-stages-of-mastering-price-action": "https://ninetrans.blogspot.com/p/stages-of-mastering-price-action.html",
    "page-price-action-trading": "https://ninetrans.blogspot.com/p/price-action-trading.html",
    "page-setup-chart": "https://ninetrans.blogspot.com/p/setup-chart.html",
    "page-trading-guide": "https://ninetrans.blogspot.com/p/trading-guide.html",
}


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def infer_url(lines: list[str], stem: str) -> str:
    for line in lines:
        if line.startswith("http"):
            return line
    for slug, url in STATIC_PAGE_URLS.items():
        if stem.startswith(slug):
            return url
    return ""


def infer_id(stem: str) -> str:
    if stem.startswith("page-"):
        return f"nt-{stem}"
    return f"nt-{stem}"


def infer_setup_candidates(text: str) -> list[str]:
    lower = text.lower()
    candidates = []
    for setup, needles in {
        "a2": ["a2", "a 2", "two legged", "2 legged"],
        "w1p": ["w1p", "1pb", "first pullback", "wedge"],
        "dp": ["dp", "double top", "double bottom", "double test"],
        "fbo": ["fbo", "failed breakout"],
        "foundation": ["signal bar", "trend", "ema", "chop", "trading range", "barb wire"],
    }.items():
        if any(needle in lower for needle in needles):
            candidates.append(setup)
    return candidates or ["uncategorized"]


def image_urls_from_html(path: Path) -> list[str]:
    if not path.exists():
        return []
    content = path.read_text(encoding="utf-8", errors="replace")
    urls = []
    for match in re.finditer(r"<img\b[^>]*\bsrc=[\"']([^\"']+)[\"']", content, flags=re.I):
        url = html_lib.unescape(match.group(1))
        if url not in urls:
            urls.append(url)
    return urls


def main() -> None:
    old_manifest_path = ARCHIVE / "manifest.json"
    old_posts = {}
    if old_manifest_path.exists():
        old_manifest = json.loads(old_manifest_path.read_text(encoding="utf-8"))
        old_posts = {post["textPath"]: post for post in old_manifest.get("posts", []) if post.get("textPath")}

    posts = []
    for text_path in sorted((ARCHIVE / "posts").glob("*.txt")):
        text = text_path.read_text(encoding="utf-8", errors="replace")
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        title = lines[0] if lines else text_path.stem
        stem = text_path.stem
        rel_text = text_path.as_posix()
        html_path = text_path.with_suffix(".html")
        rel_html = html_path.as_posix()
        existing = old_posts.get(rel_text, {})
        url = existing.get("url") or infer_url(lines, stem)
        published = existing.get("published") or (stem[:10] if re.match(r"\d{4}-\d{2}-\d{2}", stem) else "page")
        body = normalize(" ".join(lines[4:]))
        image_urls = image_urls_from_html(html_path)
        posts.append({
            "id": existing.get("id") or infer_id(stem),
            "title": existing.get("title") or title,
            "published": published,
            "updated": existing.get("updated") or published,
            "url": url,
            "htmlPath": existing.get("htmlPath") or rel_html,
            "textPath": rel_text,
            "labels": existing.get("labels") or (["static-page"] if stem.startswith("page-") else []),
            "setupCandidates": existing.get("setupCandidates") or infer_setup_candidates(text),
            "excerpt": existing.get("excerpt") or body[:700],
            "searchText": body[:12000],
            "imageCount": existing.get("imageCount") or len(image_urls),
            "images": existing.get("images") or [
                {"url": url, "localPath": None, "publicPath": None, "filename": "", "width": None, "height": None}
                for url in image_urls
            ],
        })

    manifest = {
        "source": "https://ninetrans.blogspot.com",
        "generatedAt": "rebuilt-from-local-archive",
        "postCount": len(posts),
        "imageCount": sum(post["imageCount"] for post in posts),
        "posts": posts,
    }
    old_manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"postCount": len(posts), "imageCount": manifest["imageCount"]}, indent=2))


if __name__ == "__main__":
    main()
