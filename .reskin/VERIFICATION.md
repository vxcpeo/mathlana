# Reskin verification — FAIL

Generated: 2026-10-21T17:46:50.194Z

- Project: **qubitess-website**
- URL: http://127.0.0.1:4498/
- Original skeleton: `orbital` (spatial)
- New skeleton: `orbital` (spatial)
- Accent: #6f82e8 -> #4d5bff (39.74 ΔE; min 30)
- Source contract: intact (`e9add1f651ae`)

| Route | Result | DOM similarity | Landmark similarity | Axe serious | Screenshot |
|---|---|---:|---:|---:|---|
| `/` | PASS | 0.366 | 0.5 | 0 | [desktop](current/home-desktop.png) |
| `/about` | PASS | 0.433 | 0.5 | 0 | [desktop](current/about-desktop.png) |
| `/account` | PASS | 0.342 | 0.5 | 0 | [desktop](current/account-desktop.png) |
| `/challenges` | PASS | 0.3 | 0.429 | 0 | [desktop](current/challenges-desktop.png) |
| `/challenges/:slug` | PASS | — | — | — | — |
| `/challenges/ecdsa-fail` | PASS | 0.362 | 0.571 | 0 | [desktop](current/challenges-ecdsa-fail-desktop.png) |
| `/challenges/proximity` | PASS | 0.406 | 0.5 | 0 | [desktop](current/challenges-proximity-desktop.png) |
| `/challenges/sig-golf` | PASS | 0.438 | 0.571 | 0 | [desktop](current/challenges-sig-golf-desktop.png) |
| `/exposure` | PASS | 0.462 | 0.667 | 0 | [desktop](current/exposure-desktop.png) |
| `/launch` | PASS | 0.332 | 0.333 | 0 | [desktop](current/launch-desktop.png) |
| `/privacy` | PASS | 0.258 | 0.571 | 0 | [desktop](current/privacy-desktop.png) |
| `/q-day` | PASS | 0.322 | 0.4 | 0 | [desktop](current/q-day-desktop.png) |
| `/risks` | PASS | 0.27 | 0.571 | 0 | [desktop](current/risks-desktop.png) |
| `/t/:mint` | PASS | — | — | — | — |
| `/t/preview` | PASS | 0.288 | 0.5 | 0 | [desktop](current/t-preview-desktop.png) |
| `/terms` | PASS | 0.27 | 0.571 | 0 | [desktop](current/terms-desktop.png) |
| `/tokens` | PASS | 0.246 | 0.667 | 0 | [desktop](current/tokens-desktop.png) |

## Blocking issues

- source: archetype still orbital (spatial); expected a different skeleton family

## Warnings

- bindings: "attr:item.icon" count increased 2 -> 3
- bindings: "form:item.icon" count increased 2 -> 3
- /: aria attribute changed/removed: aria-label=Contents
- /: aria attribute changed/removed: aria-label=Open the menu
- /: aria attribute changed/removed: aria-label=Sections
- /: link target no longer rendered: /#how
- /: link target no longer rendered: /about
- /: link target no longer rendered: /challenges
- /: link target no longer rendered: /exposure
- /: link target no longer rendered: /tokens
- /about: aria attribute changed/removed: aria-label=Contents
- /about: aria attribute changed/removed: aria-label=Open the menu
- /about: aria attribute changed/removed: aria-label=Sections
- /about: link target no longer rendered: /#how
- /about: link target no longer rendered: /about
- /about: link target no longer rendered: /challenges
- /about: link target no longer rendered: /exposure
- /about: link target no longer rendered: /tokens
- /account: aria attribute changed/removed: aria-label=Contents
- /account: aria attribute changed/removed: aria-label=Open the menu
- /account: aria attribute changed/removed: aria-label=Sections
- /account: link target no longer rendered: /#how
- /account: link target no longer rendered: /about
- /account: link target no longer rendered: /challenges
- /account: link target no longer rendered: /exposure
- /account: link target no longer rendered: /tokens
- /challenges: aria attribute changed/removed: aria-label=Contents
- /challenges: aria attribute changed/removed: aria-label=Open the menu
- /challenges: aria attribute changed/removed: aria-label=Sections
- /challenges: link target no longer rendered: /#how
- /challenges: link target no longer rendered: /about
- /challenges: link target no longer rendered: /challenges
- /challenges: link target no longer rendered: /exposure
- /challenges: link target no longer rendered: /tokens
- /challenges/ecdsa-fail: aria attribute changed/removed: aria-label=Contents
- /challenges/ecdsa-fail: aria attribute changed/removed: aria-label=Open the menu
- /challenges/ecdsa-fail: aria attribute changed/removed: aria-label=Sections
- /challenges/ecdsa-fail: link target no longer rendered: /#how
- /challenges/ecdsa-fail: link target no longer rendered: /about
- /challenges/ecdsa-fail: link target no longer rendered: /challenges

## Thresholds

- DOM fingerprint similarity <= 0.5
- Landmark sequence similarity <= 0.68
- CSS class overlap <= 0.1
- Accent distance >= 30 ΔE
- Contrast failures <= 0
- Axe serious/critical <= 0

All content is compared as a multiset of visible words plus rendered attribute values. Reordering is allowed, rewriting/removing/adding visible copy is not. Dynamic numeric values are reported as warnings, never silently accepted.
