#!/usr/bin/env python3
"""Rebuild the presentation layer for Cobalt Blueprint / Command Rail.

1. Rename the old namespace everywhere (classes and custom properties): pp- -> cq-.
2. Re-theme the token blocks to the cobalt blueprint palette and the geometric
   sans type scale.
3. Keep the component grammar but sharpen it into blueprint surfaces: hairlines
   instead of ink rules, 18 px surfaces, soft shadows, mono micro-labels.

The result is src/styles/rail.css; the old stylesheet leaves the render path in
main.js and is deleted at the end of the reskin.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(r"E:\workspace\chuangye\solana\mathlana\website\src")
OLD_CSS = ROOT / "styles" / "paper.css"
NEW_CSS = ROOT / "styles" / "rail.css"

TOKENS_LIGHT = """\
:root {
  --cq-ground: #dde3e9;
  --cq-sheet: #ffffff;
  --cq-sheet-soft: #efefea;
  --cq-sheet-sunk: #d3dae1;
  --cq-ink: #0a0b0d;
  --cq-ink-soft: #23262b;
  --cq-muted: #5f6368;
  --cq-muted-ground: #4d5157;
  --cq-line: #c9d2db;
  --cq-line-soft: #e1e6ec;
  --cq-line-strong: #96a1ad;
  --cq-accent: #0000ff;
  --cq-accent-text: #0000d6;
  --cq-accent-soft: #e6e9ff;
  --cq-accent-line: #b3baff;
  --cq-live: #00684a;
  --cq-live-surface: #dff1e8;
  --cq-alert: #ad2c0c;
  --cq-alert-surface: #fbe5df;
  --cq-warn: #835400;
  --cq-warn-surface: #f8efda;
  --cq-note: #4936a8;
  --cq-note-surface: #eae6fb;

  --cq-display: "Montserrat", "Inter Tight", "Segoe UI", system-ui, sans-serif;
  --cq-body: "DM Sans", "Inter", "Segoe UI", system-ui, sans-serif;
  --cq-mono: "JetBrains Mono", "Geist Mono", "Cascadia Mono", ui-monospace, monospace;

  --cq-radius-sm: 10px;
  --cq-radius: 18px;
  --cq-radius-lg: 30px;
  --cq-shadow: 0 24px 60px rgba(10, 11, 13, 0.08);
  --cq-shadow-tight: 0 10px 24px rgba(10, 11, 13, 0.06);

  --cq-rail: 76px;
  --cq-frame: clamp(20px, 3.6vw, 60px);
  --cq-max: 1440px;

  --cq-t1: clamp(4px, 0.35vw, 6px);
  --cq-t2: clamp(8px, 0.7vw, 12px);
  --cq-t3: clamp(14px, 1.2vw, 20px);
  --cq-t4: clamp(22px, 2vw, 32px);
  --cq-t5: clamp(36px, 3.4vw, 56px);
  --cq-t6: clamp(56px, 5vw, 88px);

  --cq-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --cq-fast: 170ms;
  --cq-display-weight: 620;
  --cq-display-tracking: -0.035em;
  --cq-label-tracking: 0.08em;
  color-scheme: light;
}
"""

TOKENS_DARK = """\
.dark {
  --cq-ground: #07080c;
  --cq-sheet: #0e1118;
  --cq-sheet-soft: #141821;
  --cq-sheet-sunk: #04050a;
  --cq-ink: #f2f5ff;
  --cq-ink-soft: #cfd6e6;
  --cq-muted: #98a1b0;
  --cq-muted-ground: #aab2c2;
  --cq-line: #232a38;
  --cq-line-soft: #1a202b;
  --cq-line-strong: #3a4356;
  --cq-accent: #4d5bff;
  --cq-accent-text: #aab6ff;
  --cq-accent-soft: #131a38;
  --cq-accent-line: #2f3a72;
  --cq-live: #5fd6a4;
  --cq-live-surface: #0d2b20;
  --cq-alert: #ff9c85;
  --cq-alert-surface: #33140d;
  --cq-warn: #e8c27a;
  --cq-warn-surface: #2a2110;
  --cq-note: #b9a6f5;
  --cq-note-surface: #1b1730;
  --cq-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  --cq-shadow-tight: 0 10px 24px rgba(0, 0, 0, 0.35);
  color-scheme: dark;
}
"""

# The paper grammar the override section sharpens into blueprint surfaces.
OVERRIDES = """\
/* ==========================================================================
   Cobalt blueprint overrides  --  the same grammar, a different material.
   Blueprint grey ground with a 32 px module grid, white sheets with 18 px
   corners, hairline separators, cobalt focus and fill, mono micro-labels.
   ========================================================================== */

body {
  background-color: var(--cq-ground);
  background-image:
    linear-gradient(90deg, color-mix(in srgb, var(--cq-line) 55%, transparent) 1px, transparent 1px),
    linear-gradient(180deg, color-mix(in srgb, var(--cq-line) 55%, transparent) 1px, transparent 1px);
  background-size: 32px 32px;
  font-family: var(--cq-body);
  font-size: clamp(15.5px, 0.12vw + 15px, 17px);
  letter-spacing: -0.005em;
}

.dark body,
body.dark {
  background-color: var(--cq-ground);
  background-image:
    linear-gradient(90deg, color-mix(in srgb, var(--cq-line) 42%, transparent) 1px, transparent 1px),
    linear-gradient(180deg, color-mix(in srgb, var(--cq-line) 42%, transparent) 1px, transparent 1px);
}

h1, h2, h3, h4, h5, h6,
.cq-runhead, .cq-h2, .cq-h3, .cq-h4, .cq-section-heading {
  font-family: var(--cq-display);
  font-weight: var(--cq-display-weight);
  letter-spacing: var(--cq-display-tracking);
}

.cq-kicker, .cq-label, .cq-tag, .cq-meta, .cq-micro {
  font-family: var(--cq-mono);
  letter-spacing: var(--cq-label-tracking);
}

/* Ink rules become blueprint hairlines. */
.cq-rule, .cq-hairline {
  border-color: var(--cq-line);
}

/* The paper grammar leaned on heavy ink rules; blueprint uses one hairline. */
.cq-sheet, .cq-panel, .cq-card, .cq-ledger, .cq-plate, .cq-frame, .cq-index-card {
  border: 1px solid var(--cq-line);
  border-radius: var(--cq-radius);
  background: var(--cq-sheet);
  box-shadow: var(--cq-shadow-tight);
}

/* Cobalt fill for primary affordances. */
.cq-btn--primary,
.cq-button--primary,
.cq-cta {
  background: var(--cq-accent);
  border-radius: var(--cq-radius-sm);
  color: #ffffff;
}

:where(a, button, input, select, textarea):focus-visible {
  outline: 2px solid var(--cq-accent);
  outline-offset: 2px;
}
"""


def transform_css(text: str) -> str:
    text = text.replace("--pp-", "--cq-").replace("pp-", "cq-")
    # Replace the token blocks in place.
    text = re.sub(r":root \{.*?\n\}\n", TOKENS_LIGHT, text, count=1, flags=re.S)
    text = re.sub(r"\.dark \{.*?\n\}\n", TOKENS_DARK, text, count=1, flags=re.S)
    # Blueprint material: 2 px ink rules -> hairlines.
    text = re.sub(r"2px solid var\(--cq-ink\)", "1px solid var(--cq-line)", text)
    text = re.sub(r"3px solid var\(--cq-ink\)", "1px solid var(--cq-line-strong)", text)
    return text + "\n" + OVERRIDES


def main() -> None:
    css = OLD_CSS.read_text(encoding="utf-8")
    NEW_CSS.write_text(transform_css(css), encoding="utf-8")

    changed = 0
    for path in ROOT.rglob("*.vue"):
        text = path.read_text(encoding="utf-8")
        if "pp-" not in text:
            continue
        path.write_text(text.replace("pp-", "cq-"), encoding="utf-8")
        changed += 1
    print(f"wrote {NEW_CSS.name}; rebranded {changed} .vue files")


if __name__ == "__main__":
    main()
