from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import shutil
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import asdict, dataclass
from pathlib import Path

from classification_rules import infer_setup_candidates


BASE = "https://ninetrans.blogspot.com"
USER_AGENT = "Mozilla/5.0 (compatible; ninetrans-reader-archiver/1.0)"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


@dataclass
class ImageItem:
    url: str
    localPath: str | None
    publicPath: str | None
    filename: str
    width: int | None = None
    height: int | None = None


@dataclass
class PostItem:
    id: str
    title: str
    published: str
    updated: str
    url: str
    htmlPath: str
    textPath: str
    labels: list[str]
    setupCandidates: list[str]
    excerpt: str
    searchText: str
    imageCount: int
    images: list[ImageItem]


def request(url: str, retries: int = 3) -> bytes:
    last: Exception | None = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=45) as response:
                return response.read()
        except Exception as error:  # noqa: BLE001
            last = error
            time.sleep(1.2 * (attempt + 1))
    raise RuntimeError(f"Unable to fetch {url}: {last}")


def fetch_json(url: str) -> dict:
    return json.loads(request(url).decode("utf-8"))


def canonical_url(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    return urllib.parse.urlunparse(("https", parsed.netloc, parsed.path, "", "", ""))


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def stem_for(url: str, title: str = "", published: str | None = None) -> str:
    path = urllib.parse.urlparse(url).path
    if "/p/" in path:
        slug = slugify(Path(path).stem)
        return f"page-{slug}"
    slug = slugify(title) if title else slugify(Path(path).stem)
    date = published[:10] if published and re.match(r"\d{4}-\d{2}-\d{2}", published) else ""
    return f"{date}-{slug}" if date else slug


def strip_tags(value: str) -> str:
    text = re.sub(r"(?is)<script\b.*?</script>", " ", value)
    text = re.sub(r"(?is)<style\b.*?</style>", " ", text)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


def readable_text(value: str) -> str:
    text = re.sub(r"(?i)<br\s*/?>", "\n", value)
    text = re.sub(r"(?i)</(p|div|h[1-6]|li|blockquote)>", "\n", text)
    text = re.sub(r"(?is)<script\b.*?</script>", " ", text)
    text = re.sub(r"(?is)<style\b.*?</style>", " ", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return "\n".join(line.strip() for line in text.splitlines() if line.strip())


def image_urls(content: str) -> list[str]:
    urls: list[str] = []
    for match in re.finditer(r"<img\b[^>]*\bsrc=[\"']([^\"']+)[\"']", content, flags=re.I):
        url = html.unescape(match.group(1))
        if url.startswith("//"):
            url = "https:" + url
        if url.startswith("http") and url not in urls:
            urls.append(url)
    return urls


def canonical_image_url(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    parts = [re.sub(r"^(s|w)\d+(-h\d+)?(-c)?$", "s1600", part) for part in parsed.path.split("/")]
    return urllib.parse.urlunparse(parsed._replace(path="/".join(parts), query=""))


def image_extension(url: str, content_type: str | None = None) -> str:
    suffix = Path(urllib.parse.urlparse(url).path).suffix.lower()
    if suffix in IMAGE_EXTENSIONS:
        return suffix
    if content_type and "png" in content_type:
        return ".png"
    if content_type and "webp" in content_type:
        return ".webp"
    if content_type and "gif" in content_type:
        return ".gif"
    return ".jpg"


def title_from_html(raw: str, fallback: str) -> str:
    title_match = re.search(r"<title>(.*?)</title>", raw, flags=re.I | re.S)
    title = html.unescape(re.sub(r"\s+", " ", title_match.group(1)).strip()) if title_match else fallback
    return title.replace(" | Nine Transitions", "").replace(" - Nine Transitions", "").strip()


def content_from_html(raw: str) -> str:
    body_match = re.search(r"<div[^>]+class=[\"'][^\"']*post-body[^\"']*[\"'][^>]*>(.*?)</div>\s*</div>", raw, flags=re.I | re.S)
    return body_match.group(1) if body_match else raw


def discover_posts(max_posts: int) -> list[dict]:
    entries: list[dict] = []
    start = 1
    while len(entries) < max_posts:
        data = fetch_json(f"{BASE}/feeds/posts/default?alt=json&max-results=100&start-index={start}")
        batch = data.get("feed", {}).get("entry", [])
        if not batch:
            break
        entries.extend(batch)
        start += len(batch)
    return entries[:max_posts]


def discover_pages() -> list[dict]:
    try:
        return fetch_json(f"{BASE}/feeds/pages/default?alt=json&max-results=100").get("feed", {}).get("entry", [])
    except Exception as error:  # noqa: BLE001
        print(f"warning: pages feed failed: {error}")
        return []


def discover_sitemap_urls() -> list[str]:
    urls: list[str] = []
    try:
        root = ET.fromstring(request(f"{BASE}/sitemap.xml"))
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        for loc in root.findall(".//sm:loc", ns):
            if loc.text and "ninetrans.blogspot.com" in loc.text:
                urls.append(canonical_url(loc.text))
    except Exception as error:  # noqa: BLE001
        print(f"warning: sitemap failed: {error}")
    return urls


def link_from_entry(entry: dict) -> str:
    return canonical_url(next(link["href"] for link in entry.get("link", []) if link.get("rel") == "alternate"))


def entry_to_source(entry: dict, kind: str) -> dict:
    title = entry.get("title", {}).get("$t", "").strip()
    content = entry.get("content", {}).get("$t", "")
    return {
        "kind": kind,
        "url": link_from_entry(entry),
        "title": title,
        "published": entry.get("published", {}).get("$t", "page" if kind == "page" else ""),
        "updated": entry.get("updated", {}).get("$t", ""),
        "content": content,
        "labels": [category["term"] for category in entry.get("category", [])],
    }


def download_images(content: str, out_dir: Path, public_root: Path, stem: str) -> list[ImageItem]:
    image_dir = out_dir / "images"
    image_dir.mkdir(parents=True, exist_ok=True)
    items: list[ImageItem] = []
    for index, raw_url in enumerate(image_urls(content), start=1):
        url = canonical_image_url(raw_url)
        digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:10]
        base = f"{stem}-{index:02d}-{digest}"
        existing = next(iter(image_dir.glob(base + ".*")), None)
        if existing:
            items.append(ImageItem(url=url, localPath=existing.as_posix(), publicPath=None, filename=existing.name))
            continue
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=45) as response:
                data = response.read()
                ext = image_extension(url, response.headers.get("Content-Type"))
            path = image_dir / f"{base}{ext}"
            path.write_bytes(data)
            items.append(ImageItem(url=url, localPath=path.as_posix(), publicPath=None, filename=path.name))
        except Exception as error:  # noqa: BLE001
            print(f"warning: image failed for {url}: {error}")
            items.append(ImageItem(url=url, localPath=None, publicPath=None, filename=""))
    return items


def write_source(source: dict, out_dir: Path, public_root: Path, refresh: bool) -> PostItem:
    url = canonical_url(source["url"])
    title = source.get("title", "") or ""
    content = source.get("content", "")
    if refresh or not title or not content:
        if not content:
            raw = request(url).decode("utf-8", errors="replace")
            title = title or title_from_html(raw, title or Path(urllib.parse.urlparse(url).path).stem)
            content = content_from_html(raw)
    stem = stem_for(url, title, source.get("published"))
    post_dir = out_dir / "posts"
    post_dir.mkdir(parents=True, exist_ok=True)
    html_path = post_dir / f"{stem}.html"
    text_path = post_dir / f"{stem}.txt"
    title = title or stem

    if refresh or not html_path.exists() or not text_path.exists():
        text_content = readable_text(content)
        document = (
            '<!doctype html><html><head><meta charset="utf-8">'
            f"<title>{html.escape(title)}</title>"
            f'<meta name="source-url" content="{html.escape(url)}">'
            "</head><body><article>"
            f"<h1>{html.escape(title)}</h1>"
            f'<p><a href="{html.escape(url)}">{html.escape(url)}</a></p>'
            f"{content}</article></body></html>"
        )
        html_path.write_text(document, encoding="utf-8")
        text_path.write_text(
            f"{title}\n{url}\nPublished: {source.get('published', '')}\nUpdated: {source.get('updated', '')}\n\n{text_content}\n",
            encoding="utf-8",
        )
    else:
        text_content = "\n".join(text_path.read_text(encoding="utf-8", errors="replace").splitlines()[4:])
        if not content:
            content = html_path.read_text(encoding="utf-8", errors="replace")

    images = download_images(content, out_dir, public_root, stem)
    text_all = text_path.read_text(encoding="utf-8", errors="replace")
    body = " ".join(text_all.splitlines()[4:])
    return PostItem(
        id=f"nt-{stem}",
        title=title,
        published=source.get("published", "") or ("page" if "/p/" in url else ""),
        updated=source.get("updated", ""),
        url=url,
        htmlPath=html_path.as_posix(),
        textPath=text_path.as_posix(),
        labels=source.get("labels", []) or (["static-page"] if "/p/" in url else []),
        setupCandidates=infer_setup_candidates(f"{title} {body}"),
        excerpt=strip_tags(body)[:700],
        searchText=strip_tags(body)[:12000],
        imageCount=len(images),
        images=images,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Incrementally archive all Nine Transitions posts and pages.")
    parser.add_argument("--out", default="docs/ninetrans-blog")
    parser.add_argument("--public-root", default="public")
    parser.add_argument("--max-posts", type=int, default=1000)
    parser.add_argument("--refresh-existing", action="store_true")
    parser.add_argument("--sync-public", action="store_true")
    args = parser.parse_args()

    out_dir = Path(args.out)
    public_root = Path(args.public_root)
    out_dir.mkdir(parents=True, exist_ok=True)

    sources_by_url: dict[str, dict] = {}
    for entry in discover_posts(args.max_posts):
        source = entry_to_source(entry, "post")
        sources_by_url[source["url"]] = source
    for entry in discover_pages():
        source = entry_to_source(entry, "page")
        sources_by_url[source["url"]] = source
    for url in discover_sitemap_urls():
        sources_by_url.setdefault(url, {"kind": "page" if "/p/" in url else "post", "url": url, "title": "", "published": "", "updated": "", "content": "", "labels": []})

    posts: list[PostItem] = []
    for source in sorted(sources_by_url.values(), key=lambda item: item["url"]):
        try:
            posts.append(write_source(source, out_dir, public_root, args.refresh_existing))
        except Exception as error:  # noqa: BLE001
            print(f"warning: source skipped for {source['url']}: {error}")

    manifest = {
        "source": BASE,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "postCount": len(posts),
        "imageCount": sum(post.imageCount for post in posts),
        "posts": [asdict(post) for post in posts],
    }
    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    if args.sync_public:
        target = public_root / out_dir.name
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(out_dir, target)
    print(json.dumps({"sources": len(sources_by_url), "posts": len(posts), "images": manifest["imageCount"]}, indent=2))


if __name__ == "__main__":
    main()
