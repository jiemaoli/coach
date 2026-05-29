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
        "fbo": ["fbo", "failed breakout", "final flag"],
        "foundation": ["signal bar", "ema", "barb wire", "spike and channel", "trend from the open", "trend resumption", "breakout test"],
        "1rev": ["1rev", "first reversal"],
    }.items():
        if any(needle in lower for needle in needles):
            candidates.append(setup)
    return candidates or ["uncategorized"]


def generate_normalized_tags(post: dict) -> dict:
    text = (post.get("searchText") or "").lower()
    title = (post.get("title") or "").lower()
    combined = title + " " + text
    post_id = post.get("id", "")
    labels = post.get("labels") or []
    candidates = post.get("setupCandidates") or []

    # content_type
    if post_id.startswith("nt-page-") or "static-page" in labels:
        content_type = "reference"
    elif re.match(r"^nt-\d{4}-\d{2}-\d{2}-", post_id):
        series_keywords = [
            "creating a trading system", "the hard road", "trader's mind",
            "price action basics", "channel theory", "building blocks",
        ]
        if any(kw in title for kw in series_keywords):
            content_type = "theory"
        else:
            content_type = "daily"
    else:
        content_type = "meta"

    # market
    market = []
    if "trend day" in combined or "hard trend" in combined or "strong trend" in combined:
        market.append("trend")
    if "trading range" in combined or "range day" in combined:
        market.append("range")
    if "chop" in combined or "barb wire" in combined or "barbwire" in combined:
        market.append("chop")
    if "channel" in combined or "spike and channel" in combined:
        market.append("channel")
    if not market:
        market = ["general"]

    # setup
    setup = []
    if "a2" in candidates or " a2 " in combined or "a2 short" in combined or "a2 long" in combined:
        setup.append("A2")
    if "w1p" in candidates or "w1p" in combined:
        setup.append("W1P")
    if "dp" in candidates or "double top" in combined or "double bottom" in combined:
        setup.append("DP")
    if "fbo" in candidates or "failed breakout" in combined or "fbo" in combined:
        setup.append("fBO")
    if "1pb" in combined or "first pullback" in combined:
        setup.append("1PB")
    if "1rev" in combined or "first reversal" in combined:
        setup.append("1Rev")
    if " g2 " in combined or "g2 after" in combined:
        setup.append("G2")
    if "breakout pullback" in combined or " bp " in combined:
        setup.append("BP")
    if "1cbo" in combined or "channel breakout" in combined:
        setup.append("1CBO")
    if not setup:
        setup = ["general"]

    # topic
    topic = []
    if "execution" in combined or "entry" in combined or "entering" in combined:
        topic.append("execution")
    if "trade management" in combined or "stop" in combined or "target" in combined or "exit" in combined:
        topic.append("trade_mgmt")
    if "psychology" in combined or "discipline" in combined or "emotion" in combined or "fear" in combined or "greed" in combined:
        topic.append("psychology")
    if "risk" in combined or "loss" in combined or "drawdown" in combined:
        topic.append("risk")
    if "open" in combined or "opener" in combined or "1pb" in combined or "1rev" in combined:
        topic.append("openers")
    if not topic:
        topic = ["general"]

    # level
    if any(kw in combined for kw in ["beginner", "rank beginner", "rule of ten", "getting started"]):
        level = "beginner"
    elif any(kw in combined for kw in ["advanced", "expert", "master"]):
        level = "advanced"
    else:
        level = "intermediate"

    return {
        "content_type": content_type,
        "market": market,
        "setup": setup,
        "topic": topic,
        "level": level,
    }


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

    for post in posts:
        post["normalizedTags"] = generate_normalized_tags(post)

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
