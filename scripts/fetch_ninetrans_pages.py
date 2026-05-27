from __future__ import annotations

import html
import re
import urllib.request
from pathlib import Path


PAGES = [
    "https://ninetrans.blogspot.com/p/glossary.html",
    "https://ninetrans.blogspot.com/p/price-action-trading.html",
]


def slugify(value: str) -> str:
    return "page-" + re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def readable_text(value: str) -> str:
    text = re.sub(r"(?i)<br\s*/?>", "\n", value)
    text = re.sub(r"(?i)</(p|div|h[1-6]|li|blockquote)>", "\n", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return "\n".join(line.strip() for line in text.splitlines() if line.strip())


def main() -> None:
    out = Path("docs/ninetrans-blog/posts")
    out.mkdir(parents=True, exist_ok=True)
    headers = {"User-Agent": "Mozilla/5.0"}
    homepage = urllib.request.urlopen(urllib.request.Request("https://ninetrans.blogspot.com/", headers=headers), timeout=30).read().decode("utf-8", errors="replace")
    page_urls = set(PAGES)
    page_urls.update(html.unescape(match) for match in re.findall(r"https://ninetrans\.blogspot\.com/p/[^\"'#<>]+\.html", homepage))
    for url in sorted(page_urls):
        req = urllib.request.Request(url, headers=headers)
        try:
            raw = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", errors="replace")
        except Exception as error:  # noqa: BLE001
            print(f"warning: skipped {url}: {error}")
            continue
        title_match = re.search(r"<title>(.*?)</title>", raw, flags=re.I | re.S)
        title = html.unescape(re.sub(r"\s+", " ", title_match.group(1)).strip()) if title_match else url.rsplit("/", 1)[-1]
        title = title.replace(" | Nine Transitions", "").replace(" - Nine Transitions", "").strip()
        body_match = re.search(r"<div[^>]+class=[\"'][^\"']*post-body[^\"']*[\"'][^>]*>(.*?)</div>\s*</div>", raw, flags=re.I | re.S)
        content = body_match.group(1) if body_match else raw
        slug = slugify(title)
        document = (
            '<!doctype html><html><head><meta charset="utf-8">'
            f"<title>{html.escape(title)}</title>"
            f'<meta name="source-url" content="{html.escape(url)}">'
            "</head><body><article>"
            f"<h1>{html.escape(title)}</h1>"
            f'<p><a href="{html.escape(url)}">{html.escape(url)}</a></p>'
            f"{content}</article></body></html>"
        )
        (out / f"{slug}.html").write_text(document, encoding="utf-8")
        (out / f"{slug}.txt").write_text(
            f"{title}\n{url}\nPublished: page\nUpdated: page\n\n{readable_text(content)}\n",
            encoding="utf-8",
        )
        print(slug)


if __name__ == "__main__":
    main()
