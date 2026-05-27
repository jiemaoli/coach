from __future__ import annotations

import argparse
import json
import urllib.parse
from pathlib import Path

from archive_ninetrans import BASE, canonical_url, discover_pages, discover_posts, discover_sitemap_urls, link_from_entry


def main() -> None:
    parser = argparse.ArgumentParser(description="Compare local Nine Transitions archive against Blogger feeds and sitemap.")
    parser.add_argument("--archive", default="docs/ninetrans-blog")
    parser.add_argument("--max-posts", type=int, default=1000)
    args = parser.parse_args()

    manifest = json.loads((Path(args.archive) / "manifest.json").read_text(encoding="utf-8"))
    manifest_urls = {canonical_url(post["url"]) for post in manifest.get("posts", []) if post.get("url")}

    post_urls = {canonical_url(link_from_entry(entry)) for entry in discover_posts(args.max_posts)}
    page_urls = {canonical_url(link_from_entry(entry)) for entry in discover_pages()}
    sitemap_urls = {canonical_url(url) for url in discover_sitemap_urls()}
    discovered_urls = {url for url in (post_urls | page_urls | sitemap_urls) if urllib.parse.urlparse(url).netloc == "ninetrans.blogspot.com"}

    missing = sorted(discovered_urls - manifest_urls)
    extra = sorted(manifest_urls - discovered_urls)
    report = {
        "source": BASE,
        "manifestCount": len(manifest_urls),
        "postFeedCount": len(post_urls),
        "pageFeedCount": len(page_urls),
        "sitemapCount": len(sitemap_urls),
        "discoveredUnionCount": len(discovered_urls),
        "missingCount": len(missing),
        "extraCount": len(extra),
        "missing": missing,
        "extra": extra,
    }
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
