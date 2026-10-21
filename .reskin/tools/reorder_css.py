from pathlib import Path

p = Path(r"E:\workspace\chuangye\solana\mathlana\website\src\styles\shell.css")
css = p.read_text(encoding="utf-8")

start = css.index("/* ---------- responsive")
end = css.index("/* ---------- primitives")
responsive = css[start:end]
css = css[:start] + css[end:]

extra = """
  .cq-command__bar {
    padding: 8px 10px;
    gap: 8px;
    min-width: 0;
  }

  .cq-command__actions {
    gap: 6px;
    min-width: 0;
  }

  .cq-command__cta {
    display: none;
  }
"""

css = css.replace(
    "  .cq-command__meter {\n    display: none;\n  }\n",
    "  .cq-command__meter {\n    display: none;\n  }\n" + extra,
)

css = css.replace(
    """@media (max-width: 560px) {
  .cq-command__bar {
    padding: 10px 10px 10px 14px;
    gap: 10px;
  }

  .cq-command__word {
    font-size: 18px;
  }

  .cq-command__cta {
    display: none;
  }
}""",
    """@media (max-width: 560px) {
  .cq-command__bar {
    padding: 8px 8px 8px 12px;
    gap: 8px;
    border-radius: 20px;
  }

  .cq-command__brand {
    min-width: 0;
  }

  .cq-command__word {
    font-size: 16.5px;
  }

  .cq-command__actions .cq-btn {
    height: 32px;
    padding: 0 10px;
    font-size: 9.5px;
    letter-spacing: 0.06em;
  }

  .cq-command__menu {
    width: 32px;
    min-width: 32px;
  }
}""",
)

css = css.rstrip() + "\n\n" + responsive.strip() + "\n"
p.write_text(css, encoding="utf-8")
print("responsive block moved to the end; size:", len(css))
print("cta rules:", css.count(".cq-command__cta"))
