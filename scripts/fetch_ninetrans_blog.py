from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import time
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass
from pathlib import Path

from classification_rules import infer_setup_candidates


BLOG_FEED = "https://ninetrans.blogspot.com/feeds/posts/default"
USER_AGENT = "Mozilla/5.0 (compatible; setup-coach-source-fetcher/1.0)"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
STATIC_PAGES = [
    "https://ninetrans.blogspot.com/p/glossary.html",
    "https://ninetrans.blogspot.com/p/stages-of-mastering-price-action.html",
]
@dataclass
class BlogImage:
    url: str
    localPath: str | None
    publicPath: str | None
    filename: str
    width: int | None
    height: int | None


@dataclass
class BlogPost:
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
    images: list[BlogImage]


def request_bytes(url: str, retries: int = 3) -> bytes:
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=45) as response:
                return response.read()
        except Exception as error:  # noqa: BLE001 - keep fetcher resilient.
            last_error = error
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"Unable to fetch {url}: {last_error}")


def fetch_json(url: str) -> dict:
    return json.loads(request_bytes(url).decode("utf-8"))


def strip_tags(value: str) -> str:
    text = re.sub(r"<script\b.*?</script>", " ", value, flags=re.I | re.S)
    text = re.sub(r"<style\b.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


def readable_text(value: str) -> str:
    text = re.sub(r"(?i)<br\s*/?>", "\n", value)
    text = re.sub(r"(?i)</(p|div|h[1-6]|li|blockquote)>", "\n", text)
    text = re.sub(r"<script\b.*?</script>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<style\b.*?</style>", " ", text, flags=re.I | re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line)


def slugify(value: str, fallback: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:80] or fallback


def image_urls_from_html(content: str) -> list[str]:
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
    # Blogger image URLs often include size segments such as /s320/ or /w1200-h630/.
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


def to_public_path(path: Path, public_root: Path) -> str | None:
    try:
        return str(path.relative_to(public_root).as_posix())
    except ValueError:
        return None


def download_image(url: str, output_dir: Path, public_root: Path, stem: str, index: int) -> BlogImage:
    canonical = canonical_image_url(url)
    req = urllib.request.Request(canonical, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=45) as response:
        data = response.read()
        content_type = response.headers.get("Content-Type")
    digest = hashlib.sha1(canonical.encode("utf-8")).hexdigest()[:10]
    filename = f"{stem}-{index:02d}-{digest}{image_extension(canonical, content_type)}"
    path = output_dir / filename
    path.write_bytes(data)
    return BlogImage(
        url=canonical,
        localPath=str(path.as_posix()),
        publicPath=to_public_path(path, public_root),
        filename=filename,
        width=None,
        height=None,
    )


def write_post_backup(post_dir: Path, stem: str, title: str, url: str, published: str, updated: str, content: str) -> tuple[str, str, str]:
    post_dir.mkdir(parents=True, exist_ok=True)
    html_path = post_dir / f"{stem}.html"
    text_path = post_dir / f"{stem}.txt"
    document = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{html.escape(title)}</title>
    <meta name="source-url" content="{html.escape(url)}">
    <meta name="published" content="{html.escape(published)}">
    <meta name="updated" content="{html.escape(updated)}">
  </head>
  <body>
    <article data-source="ninetrans.blogspot.com">
      <h1>{html.escape(title)}</h1>
      <p><a href="{html.escape(url)}">{html.escape(url)}</a></p>
      {content}
    </article>
  </body>
</html>
"""
    html_path.write_text(document, encoding="utf-8")
    text_content = readable_text(content)
    text_path.write_text(f"{title}\n{url}\nPublished: {published}\nUpdated: {updated}\n\n{text_content}\n", encoding="utf-8")
    return html_path.as_posix(), text_path.as_posix(), text_content


def parse_entry(entry: dict, download_images: bool, output_dir: Path, public_root: Path) -> BlogPost:
    title = entry["title"]["$t"].strip()
    published = entry["published"]["$t"]
    updated = entry["updated"]["$t"]
    post_url = next(link["href"] for link in entry["link"] if link.get("rel") == "alternate")
    content = entry.get("content", {}).get("$t", "")
    labels = [category["term"] for category in entry.get("category", [])]
    fallback = entry["id"]["$t"].rsplit("-", 1)[-1]
    stem = f"{published[:10]}-{slugify(title, fallback)}"
    html_path, text_path, text_content = write_post_backup(output_dir / "posts", stem, title, post_url, published, updated, content)

    images: list[BlogImage] = []
    for index, image_url in enumerate(image_urls_from_html(content), start=1):
        if download_images:
            try:
                images.append(download_image(image_url, output_dir / "images", public_root, stem, index))
            except Exception as error:  # noqa: BLE001
                images.append(BlogImage(url=canonical_image_url(image_url), localPath=None, publicPath=None, filename="", width=None, height=None))
                print(f"warning: image download failed for {image_url}: {error}")
        else:
            images.append(BlogImage(url=canonical_image_url(image_url), localPath=None, publicPath=None, filename="", width=None, height=None))

    return BlogPost(
        id=f"nt-{published[:10]}-{slugify(title, fallback)}",
        title=title,
        published=published,
        updated=updated,
        url=post_url,
        htmlPath=html_path,
        textPath=text_path,
        labels=labels,
        setupCandidates=infer_setup_candidates(f"{title} {strip_tags(content)}"),
        excerpt=strip_tags(content)[:700],
        searchText=text_content[:12000],
        imageCount=len(images),
        images=images,
    )


def parse_static_page(url: str, download_images: bool, output_dir: Path, public_root: Path) -> BlogPost:
    raw = request_bytes(url).decode("utf-8", errors="replace")
    title_match = re.search(r"<title>(.*?)</title>", raw, flags=re.I | re.S)
    title = html.unescape(re.sub(r"\s+", " ", title_match.group(1)).strip()) if title_match else url.rsplit("/", 1)[-1]
    title = title.replace(" | Nine Transitions", "").replace(" - Nine Transitions", "").strip()
    content_match = re.search(r"<div[^>]+class=['\"][^'\"]*post-body[^'\"]*['\"][^>]*>(.*?)</div>\s*</div>", raw, flags=re.I | re.S)
    content = content_match.group(1) if content_match else raw
    stem = f"page-{slugify(title, url.rsplit('/', 1)[-1])}"
    html_path, text_path, text_content = write_post_backup(output_dir / "posts", stem, title, url, "page", "page", content)

    images: list[BlogImage] = []
    for index, image_url in enumerate(image_urls_from_html(content), start=1):
        if download_images:
            try:
                images.append(download_image(image_url, output_dir / "images", public_root, stem, index))
            except Exception as error:  # noqa: BLE001
                images.append(BlogImage(url=canonical_image_url(image_url), localPath=None, publicPath=None, filename="", width=None, height=None))
                print(f"warning: image download failed for {image_url}: {error}")
        else:
            images.append(BlogImage(url=canonical_image_url(image_url), localPath=None, publicPath=None, filename="", width=None, height=None))

    return BlogPost(
        id=f"nt-page-{slugify(title, url)}",
        title=title,
        published="page",
        updated="page",
        url=url,
        htmlPath=html_path,
        textPath=text_path,
        labels=["static-page"],
        setupCandidates=infer_setup_candidates(f"{title} {strip_tags(content)}"),
        excerpt=strip_tags(content)[:700],
        searchText=text_content[:12000],
        imageCount=len(images),
        images=images,
    )


def fetch_posts(max_posts: int, download_images: bool, output_dir: Path, public_root: Path) -> list[BlogPost]:
    image_dir = output_dir / "images"
    image_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "posts").mkdir(parents=True, exist_ok=True)
    posts: list[BlogPost] = []
    start = 1
    page_size = min(100, max_posts)
    while len(posts) < max_posts:
        url = f"{BLOG_FEED}?alt=json&max-results={page_size}&start-index={start}"
        feed = fetch_json(url).get("feed", {})
        entries = feed.get("entry", [])
        if not entries:
            break
        for entry in entries:
            posts.append(parse_entry(entry, download_images, output_dir, public_root))
            if len(posts) >= max_posts:
                break
        start += len(entries)
    return posts


def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch first-party Nine Transitions blog posts and original chart images.")
    parser.add_argument("--max-posts", type=int, default=500)
    parser.add_argument("--no-images", action="store_true")
    parser.add_argument("--out", default="public/ninetrans-blog")
    parser.add_argument("--public-root", default="public")
    args = parser.parse_args()

    output_dir = Path(args.out)
    public_root = Path(args.public_root)
    output_dir.mkdir(parents=True, exist_ok=True)
    posts = fetch_posts(args.max_posts, not args.no_images, output_dir, public_root)
    existing_urls = {post.url for post in posts}
    for page_url in STATIC_PAGES:
        if page_url not in existing_urls:
            try:
                posts.append(parse_static_page(page_url, not args.no_images, output_dir, public_root))
            except Exception as error:  # noqa: BLE001
                print(f"warning: static page skipped for {page_url}: {error}")
    manifest = {
        "source": "https://ninetrans.blogspot.com",
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "postCount": len(posts),
        "imageCount": sum(post.imageCount for post in posts),
        "posts": [asdict(post) for post in posts],
    }
    (output_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({k: manifest[k] for k in ["source", "postCount", "imageCount"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
