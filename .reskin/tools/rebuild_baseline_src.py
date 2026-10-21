#!/usr/bin/env python3
"""Rebuild the pre-reskin (paper / Qubitess) site in a throwaway copy.

The reskin baseline pages were not captured before the presentation layer was
rewritten. Rather than guess, this reconstructs the exact pre-reskin state from
the rebrand backup (taken minutes before the reskin started), re-applies the
same brand mapping and manual corrections the rebrand made, and hands the copy
to `verify.mjs baseline`.
"""

from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(r"E:\workspace\chuangye\solana\mathlana")
WEBSITE = ROOT / "website"
BACKUP = ROOT / ".rebrand" / "backup" / "20261022-004458" / "website"
TEMP = Path(r"E:\workspace\chuangye\solana\mathlana-baseline\website")

SKIP = {"node_modules", "dist", ".reskin", ".rebrand", ".git"}


def copy_tree(src: Path, dst: Path) -> None:
    dst.mkdir(parents=True, exist_ok=True)
    for item in src.iterdir():
        if item.name in SKIP:
            continue
        target = dst / item.name
        if item.is_dir():
            shutil.copytree(item, target, dirs_exist_ok=True, ignore=shutil.ignore_patterns(*SKIP))
        else:
            shutil.copy2(item, target)


def main() -> None:
    if TEMP.exists():
        shutil.rmtree(TEMP)
    copy_tree(WEBSITE, TEMP)

    # Restore every file the rebrand touched inside the website to its
    # pre-rebrand bytes (paper UI, Qubitlane text).
    restored = 0
    for src in BACKUP.rglob("*"):
        if not src.is_file():
            continue
        rel = src.relative_to(BACKUP)
        if any(part in SKIP for part in rel.parts):
            continue
        target = TEMP / rel
        if not target.exists():
            continue
        shutil.copy2(src, target)
        restored += 1

    mapping = [
        ("Qubitlane", "Qubitess"),
        ("qubitlane", "qubitess"),
        ("QUBITLANE", "QUBITESS"),
    ]
    text_suffixes = {".vue", ".js", ".json", ".html", ".css", ".md", ".txt", ".svg"}
    touched = 0
    for path in TEMP.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in text_suffixes:
            continue
        text = path.read_text(encoding="utf-8")
        new = text
        for old, rep in mapping:
            new = new.replace(old, rep)
        # the rebrand's manual corrections: split wordmark + program const
        new = new.replace("Qubit<span>lane</span>", "Qubit<span>ess</span>")
        new = new.replace('Qubit<span class="cq-account__wordmark-accent">lane</span>',
                          'Qubit<span class="cq-account__wordmark-accent">ess</span>')
        new = new.replace("Qubit<span class=\"pp-account__wordmark-accent\">lane</span>",
                          "Qubit<span class=\"pp-account__wordmark-accent\">ess</span>")
        if new != text:
            path.write_text(new, encoding="utf-8")
            touched += 1

    print(f"restored {restored} files from backup, remapped {touched} text files -> {TEMP}")


if __name__ == "__main__":
    main()
