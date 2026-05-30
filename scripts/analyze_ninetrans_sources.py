from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path

from classification_rules import CLASSIFICATION_RULES


LEARNING_SIGNAL_PATTERNS = {
    "beginner": [
        r"\bbeginner[s]?\b",
        r"\bnew trader[s]?\b",
        r"\bstart(?:ing)?\b",
        r"\bfirst thing\b",
        r"\blearn\b",
    ],
    "author_recommendation": [
        r"\bshould\b",
        r"\bmust\b",
        r"\bbest\b",
        r"\bfirst\b",
        r"\bstick to\b",
        r"\bavoid\b",
        r"\bdo not\b",
        r"\bdon't\b",
        r"\bnever\b",
    ],
    "training": [
        r"\bsim\b",
        r"\bsimulator\b",
        r"\brule of 10\b",
        r"\bpractice\b",
        r"\bdiscipline\b",
        r"\bovertrading\b",
    ],
}

# Derived from classification_rules.json: topic = setup + market + topic dimensions flattened
_flat_setup = set()
for _k, _v in CLASSIFICATION_RULES["setupCandidates"].items():
    _flat_setup.update(_v)
for _k, _v in CLASSIFICATION_RULES["normalizedTags"]["setup"].items():
    _flat_setup.update(_v.get("needles", []))

_flat_market = set()
for _k, _v in CLASSIFICATION_RULES["normalizedTags"]["market"].items():
    _flat_market.update(_v)

_flat_topic = set()
for _k, _v in CLASSIFICATION_RULES["normalizedTags"]["topic"].items():
    _flat_topic.update(_v)

TOPIC_KEYWORDS = {
    "signal_bar": ["signal bar", "trend bar", "doji", "tail", "overlap", "inside bar", "outside bar"],
    "market_state": sorted(_flat_market, key=len, reverse=True),
    "beginner_rules": sorted(CLASSIFICATION_RULES["normalizedTags"]["level"]["beginner"] + ["simulator", "overtrading", "avoid"], key=len, reverse=True),
    "openers": ["openers", "opening", "open", "gap", "1w", "1p", "1pb", "ib2", "opening range", "opener"],
    "setups": sorted(_flat_setup, key=len, reverse=True),
    "execution_risk": ["entry", "stop", "target", "mae", "tight stop", "scalp", "swing", "risk", "reward"],
    "advanced_context": ["trend termination", "failed", "multi", "timeframe", "breakout", "trapped", "reversal"],
    "psychology_training": sorted(list(CLASSIFICATION_RULES["normalizedTags"]["topic"]["psychology"]) + list(_flat_topic), key=len, reverse=True),
}

KEY_ARTICLE_HINTS = [
    "trading guide",
    "price action trading",
    "setup chart",
    "glossary",
    "rule of ten",
    "rule of 10",
    "first principles",
    "openers",
    "beginner",
]


@dataclass
class Evidence:
    post_id: str
    title: str
    published: str
    url: str
    text_path: str
    reason: str
    quote: str


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def split_sentences(text: str) -> list[str]:
    rough = re.split(r"(?<=[.!?])\s+|\n+", text)
    return [normalize(sentence) for sentence in rough if len(normalize(sentence)) > 35]


def matches_any(sentence: str, patterns: list[str]) -> bool:
    lower = sentence.lower()
    return any(re.search(pattern, lower) for pattern in patterns)


def topic_scores(text: str) -> dict[str, int]:
    lower = text.lower()
    scores: dict[str, int] = {}
    for topic, keywords in TOPIC_KEYWORDS.items():
        scores[topic] = sum(lower.count(keyword) for keyword in keywords)
    return scores


def quote(sentence: str, limit: int = 260) -> str:
    return sentence if len(sentence) <= limit else sentence[: limit - 3].rstrip() + "..."


def collect_evidence(posts: list[dict], root: Path) -> tuple[list[Evidence], Counter[str], dict[str, list[dict]]]:
    evidence: list[Evidence] = []
    topic_counter: Counter[str] = Counter()
    topic_posts: dict[str, list[dict]] = defaultdict(list)

    for post in posts:
        text_path = root / post["textPath"]
        if not text_path.exists():
            continue
        text = text_path.read_text(encoding="utf-8", errors="replace")
        scores = topic_scores(f"{post['title']} {text}")
        for topic, score in scores.items():
            if score:
                topic_counter[topic] += score
                topic_posts[topic].append({**post, "topicScore": score})

        title_lower = post["title"].lower()
        for hint in KEY_ARTICLE_HINTS:
            if hint in title_lower:
                evidence.append(Evidence(
                    post_id=post["id"],
                    title=post["title"],
                    published=post["published"][:10],
                    url=post["url"],
                    text_path=post["textPath"],
                    reason=f"title contains '{hint}'",
                    quote=quote(post.get("excerpt", "")),
                ))

        for sentence in split_sentences(text):
            reasons = [
                name
                for name, patterns in LEARNING_SIGNAL_PATTERNS.items()
                if matches_any(sentence, patterns)
            ]
            if len(reasons) >= 2:
                evidence.append(Evidence(
                    post_id=post["id"],
                    title=post["title"],
                    published=post["published"][:10],
                    url=post["url"],
                    text_path=post["textPath"],
                    reason=", ".join(reasons),
                    quote=quote(sentence),
                ))
                break

    return evidence, topic_counter, topic_posts


def render_report(manifest: dict, evidence: list[Evidence], topic_counter: Counter[str], topic_posts: dict[str, list[dict]]) -> str:
    lines: list[str] = []
    lines.append("# Nine Transitions Source Analysis")
    lines.append("")
    lines.append("This report is generated from the local archive of `https://ninetrans.blogspot.com`.")
    lines.append("It separates direct author evidence from provisional organization work.")
    lines.append("")
    lines.append("## Archive Summary")
    lines.append("")
    lines.append(f"- Source: {manifest.get('source')}")
    lines.append(f"- Generated at: {manifest.get('generatedAt')}")
    lines.append(f"- Posts archived: {manifest.get('postCount')}")
    lines.append(f"- Images indexed: {manifest.get('imageCount')}")
    lines.append("")
    lines.append("## Direct Author Signals")
    lines.append("")
    lines.append("These are candidate posts/sentences where the author appears to discuss learning order, beginners, training, or explicit should/avoid guidance. They still need human review before becoming the official study path.")
    lines.append("")
    for item in evidence[:80]:
        lines.append(f"### {item.title} ({item.published})")
        lines.append("")
        lines.append(f"- Reason: {item.reason}")
        lines.append(f"- URL: {item.url}")
        lines.append(f"- Local text: `{item.text_path}`")
        if item.quote:
            lines.append(f"- Evidence: {item.quote}")
        lines.append("")

    lines.append("## Topic Frequency")
    lines.append("")
    for topic, count in topic_counter.most_common():
        lines.append(f"- `{topic}`: {count}")
    lines.append("")

    lines.append("## Strong Candidate Posts By Topic")
    lines.append("")
    for topic in TOPIC_KEYWORDS:
        candidates = sorted(topic_posts.get(topic, []), key=lambda post: post["topicScore"], reverse=True)[:12]
        lines.append(f"### {topic}")
        lines.append("")
        if not candidates:
            lines.append("- No candidates found.")
        for post in candidates:
            lines.append(f"- {post['published'][:10]} · {post['title']} · score {post['topicScore']} · {post['url']}")
        lines.append("")

    lines.append("## Provisional Study Path Constraint")
    lines.append("")
    lines.append("Do not finalize a beginner path from frequency alone. The next step is to review the Direct Author Signals, identify the author's own sequencing advice, then use topic tags only for secondary ordering.")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Analyze archived Nine Transitions sources for author-led study path clues.")
    parser.add_argument("--archive", default="docs/ninetrans-blog")
    parser.add_argument("--out", default="docs/ninetrans-blog/source-analysis.md")
    args = parser.parse_args()

    root = Path(".")
    archive = Path(args.archive)
    manifest_path = archive / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    post_dir = archive / "posts"
    archived_texts = sorted(post_dir.glob("*.txt"))
    if len(archived_texts) > len(manifest.get("posts", [])):
        posts_by_text = {post.get("textPath"): post for post in manifest.get("posts", [])}
        posts = []
        for text_path in archived_texts:
            rel_text_path = text_path.as_posix()
            html_path = text_path.with_suffix(".html")
            text = text_path.read_text(encoding="utf-8", errors="replace")
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            title = lines[0] if lines else text_path.stem
            url = next((line for line in lines if line.startswith("http")), "")
            existing = posts_by_text.get(rel_text_path, {})
            posts.append({
                "id": existing.get("id", f"nt-{text_path.stem}"),
                "title": existing.get("title", title),
                "published": existing.get("published", text_path.name[:10]),
                "updated": existing.get("updated", ""),
                "url": existing.get("url", url),
                "htmlPath": html_path.as_posix(),
                "textPath": rel_text_path,
                "labels": existing.get("labels", []),
                "setupCandidates": existing.get("setupCandidates", []),
                "excerpt": existing.get("excerpt", normalize(" ".join(lines[4:]))[:700]),
                "imageCount": existing.get("imageCount", 0),
                "images": existing.get("images", []),
            })
        manifest = {
            **manifest,
            "postCount": len(posts),
            "posts": posts,
            "analysisNote": "Manifest was reconstructed from archived TXT files because archive files exceeded the last completed manifest.",
        }
    evidence, topic_counter, topic_posts = collect_evidence(manifest["posts"], root)
    report = render_report(manifest, evidence, topic_counter, topic_posts)
    Path(args.out).write_text(report, encoding="utf-8")
    print(json.dumps({
        "posts": manifest.get("postCount"),
        "images": manifest.get("imageCount"),
        "evidenceItems": len(evidence),
        "out": args.out,
    }, indent=2))


if __name__ == "__main__":
    main()

