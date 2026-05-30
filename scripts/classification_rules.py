from __future__ import annotations

import json
import re
from pathlib import Path


RULES_PATH = Path(__file__).with_name("classification_rules.json")
CLASSIFICATION_RULES = json.loads(RULES_PATH.read_text(encoding="utf-8"))


def _normalize_text(value: str | None) -> str:
    return (value or "").lower()


def _build_combined_text(post: dict) -> str:
    return f"{_normalize_text(post.get('title'))} {_normalize_text(post.get('searchText'))}".strip()


def _matches_any(text: str, needles: list[str]) -> bool:
    return any(needle in text for needle in needles)


def infer_setup_candidates(text: str) -> list[str]:
    lower = _normalize_text(text)
    candidates = [
        setup
        for setup, needles in CLASSIFICATION_RULES["setupCandidates"].items()
        if _matches_any(lower, needles)
    ]
    return candidates or ["uncategorized"]


def generate_normalized_tags(post: dict) -> dict:
    combined = _build_combined_text(post)
    labels = post.get("labels") or []
    candidates = post.get("setupCandidates") or []
    defaults = CLASSIFICATION_RULES["defaults"]

    post_id = post.get("id", "")
    if post_id.startswith("nt-page-") or "static-page" in labels:
        content_type = "reference"
    elif re.match(r"^nt-\d{4}-\d{2}-\d{2}-", post_id):
        content_type = (
            "theory"
            if _matches_any(_normalize_text(post.get("title")), CLASSIFICATION_RULES["contentType"]["seriesKeywords"])
            else "daily"
        )
    else:
        content_type = defaults["content_type"]

    market = [
        tag
        for tag, needles in CLASSIFICATION_RULES["normalizedTags"]["market"].items()
        if _matches_any(combined, needles)
    ]

    setup = []
    for tag, config in CLASSIFICATION_RULES["normalizedTags"]["setup"].items():
        candidate_match = any(candidate in candidates for candidate in config.get("candidates", []))
        if candidate_match or _matches_any(combined, config.get("needles", [])):
            setup.append(tag)

    topic = [
        tag
        for tag, needles in CLASSIFICATION_RULES["normalizedTags"]["topic"].items()
        if _matches_any(combined, needles)
    ]

    if _matches_any(combined, CLASSIFICATION_RULES["normalizedTags"]["level"]["beginner"]):
        level = "beginner"
    elif _matches_any(combined, CLASSIFICATION_RULES["normalizedTags"]["level"]["advanced"]):
        level = "advanced"
    else:
        level = defaults["level"]

    return {
        "content_type": content_type,
        "market": market or [defaults["market"]],
        "setup": setup or [defaults["setup"]],
        "topic": topic or [defaults["topic"]],
        "level": level,
    }
