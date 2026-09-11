#!/usr/bin/env python3
"""Validate the files and local references required by the storefront template."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
ENTRYPOINT = ROOT / "index.html"


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def local_path(raw_url: str, source: Path) -> Path | None:
    """Resolve a local URL, ignoring fragments, queries, and external URLs."""
    value = raw_url.strip()
    parsed = urlparse(value)
    if parsed.scheme or parsed.netloc or value.startswith("//"):
        return None
    path = unquote(parsed.path)
    if not path:
        return None
    return (source.parent / path).resolve()


def check_references(source: Path, references: list[str]) -> None:
    missing: list[str] = []
    for reference in references:
        resolved = local_path(reference, source)
        if resolved is not None and not resolved.is_file():
            missing.append(f"{source.relative_to(ROOT)} -> {reference}")
    if missing:
        fail("missing local references:\n  " + "\n  ".join(sorted(set(missing))))


def main() -> int:
    if not ENTRYPOINT.is_file():
        fail("index.html is missing")

    html = ENTRYPOINT.read_text(encoding="utf-8")
    if not re.search(r"<!doctype\s+html>", html, re.IGNORECASE):
        fail("index.html is missing an HTML5 doctype")
    if not re.search(r"<title\b[^>]*>\s*\S", html, re.IGNORECASE):
        fail("index.html is missing a non-empty title")

    html_references = re.findall(
        r"(?:src|href)\s*=\s*['\"]([^'\"]+)['\"]", html, re.IGNORECASE
    )
    check_references(ENTRYPOINT, html_references)

    css = ROOT / "assets/css/styles.css"
    css_references = re.findall(
        r"url\(\s*['\"]?([^'\")]+)", css.read_text(encoding="utf-8"), re.IGNORECASE
    )
    check_references(css, css_references)

    javascript_files = sorted((ROOT / "assets/js").glob("*.js"))
    for javascript_file in javascript_files:
        result = subprocess.run(
            ["node", "--check", str(javascript_file)], capture_output=True, text=True
        )
        if result.returncode:
            fail(
                f"JavaScript syntax check failed for {javascript_file.relative_to(ROOT)}:\n"
                f"{result.stderr.strip()}"
            )

    reference_count = len(html_references) + len(css_references)
    print(
        f"Validated {ENTRYPOINT.relative_to(ROOT)}, {reference_count} local/external references, "
        f"and {len(javascript_files)} JavaScript files."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
