# Reskin verification — FAIL

Generated: 2026-10-20T16:26:41.682Z

- Project: **qubitlane-website**
- URL: http://127.0.0.1:4499/
- Original skeleton: `orbital` (spatial)
- New skeleton: `orbital` (spatial)
- Accent: #0000ff -> #6f82e8 (82.95 ΔE; min 30)
- Source contract: intact (`32e21d29b635`)

| Route | Result | DOM similarity | Landmark similarity | Axe serious | Screenshot |
|---|---|---:|---:|---:|---|
| `/` | PASS | 0.375 | 0.5 | 0 | [desktop](current/home-desktop.png) |
| `/about` | PASS | 0.365 | 0.5 | 0 | [desktop](current/about-desktop.png) |
| `/account` | PASS | 0.42 | 0.5 | 0 | [desktop](current/account-desktop.png) |
| `/challenges` | PASS | 0.356 | 0.5 | 0 | [desktop](current/challenges-desktop.png) |
| `/challenges/:slug` | PASS | — | — | — | — |
| `/challenges/ecdsa-fail` | PASS | 0.349 | 0.5 | 0 | [desktop](current/challenges-ecdsa-fail-desktop.png) |
| `/challenges/proximity` | PASS | 0.324 | 0.5 | 0 | [desktop](current/challenges-proximity-desktop.png) |
| `/challenges/sig-golf` | PASS | 0.352 | 0.5 | 0 | [desktop](current/challenges-sig-golf-desktop.png) |
| `/exposure` | PASS | 0.389 | 0.5 | 0 | [desktop](current/exposure-desktop.png) |
| `/launch` | PASS | 0.313 | 0.5 | 0 | [desktop](current/launch-desktop.png) |
| `/privacy` | PASS | 0.385 | 0.571 | 0 | [desktop](current/privacy-desktop.png) |
| `/q-day` | PASS | 0.375 | 0.5 | 0 | [desktop](current/q-day-desktop.png) |
| `/risks` | PASS | 0.408 | 0.571 | 0 | [desktop](current/risks-desktop.png) |
| `/t/:mint` | PASS | — | — | — | — |
| `/t/preview` | PASS | 0.452 | 0.5 | 0 | [desktop](current/t-preview-desktop.png) |
| `/terms` | PASS | 0.408 | 0.571 | 0 | [desktop](current/terms-desktop.png) |
| `/tokens` | PASS | 0.299 | 0.5 | 0 | [desktop](current/tokens-desktop.png) |

## Blocking issues

- source: archetype still orbital (spatial); expected a different skeleton family

## Warnings

- bindings: "attr:item.to" count increased 12 -> 13
- bindings: "interpolation:item.label" count increased 14 -> 15
- bindings: "link:item.to" count increased 12 -> 13
- /: aria attribute added: aria-label=About
- /: aria attribute added: aria-label=Challenges
- /: aria attribute added: aria-label=Check a wallet
- /: aria attribute added: aria-label=Contents
- /: aria attribute added: aria-label=How it works
- /: aria attribute added: aria-label=Open the menu
- /: aria attribute added: aria-label=Sections
- /: aria attribute added: aria-label=Tokens
- /: link target added: /#how
- /: link target added: /about
- /: link target added: /challenges
- /: link target added: /exposure
- /: link target added: /tokens
- /about: aria attribute added: aria-label=About
- /about: aria attribute added: aria-label=Challenges
- /about: aria attribute added: aria-label=Check a wallet
- /about: aria attribute added: aria-label=Contents
- /about: aria attribute added: aria-label=How it works
- /about: aria attribute added: aria-label=Open the menu
- /about: aria attribute added: aria-label=Sections
- /about: aria attribute added: aria-label=Tokens
- /about: link target added: /#how
- /about: link target added: /about
- /about: link target added: /challenges
- /about: link target added: /exposure
- /about: link target added: /tokens
- /account: aria attribute added: aria-label=About
- /account: aria attribute added: aria-label=Challenges
- /account: aria attribute added: aria-label=Check a wallet
- /account: aria attribute added: aria-label=Contents
- /account: aria attribute added: aria-label=How it works
- /account: aria attribute added: aria-label=Open the menu
- /account: aria attribute added: aria-label=Sections
- /account: aria attribute added: aria-label=Tokens
- /account: link target added: /#how
- /account: link target added: /about
- /account: link target added: /challenges

## Thresholds

- DOM fingerprint similarity <= 0.5
- Landmark sequence similarity <= 0.68
- CSS class overlap <= 0.1
- Accent distance >= 30 ΔE
- Contrast failures <= 0
- Axe serious/critical <= 0

All content is compared as a multiset of visible words plus rendered attribute values. Reordering is allowed, rewriting/removing/adding visible copy is not. Dynamic numeric values are reported as warnings, never silently accepted.
