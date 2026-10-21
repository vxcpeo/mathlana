# Reskin inventory — qubitlane-website

Generated: 2026-10-20T16:01:39.583Z

## Project

| Field | Value |
|---|---|
| Root | `E:/workspace/chuangye/solana/mathlana/website` |
| Vue | ^3.5.13 |
| Package manager | pnpm |
| Nuxt | no |
| CSS frameworks | @tailwindcss/vite, tailwindcss |
| Files scanned | 153 (136 SFCs) |

## Original skeleton

- Archetype: **orbital** (spatial)
- Traits: sidebar, cards, hero, table, grid, tabs, modal, sticky, orbital, ticker
- Max template depth: 11
- Top-level tags: div, div, svg, svg, svg, article, section, svg, icon, div, div, div, div, span, svg, div, svg, svg, section, section, section, section, li, launchstep, div, svg, section, launchstep, div, footer, header, section, article, li, article, svg, svg, section, span, section, section, section, panelcard, section, div, routerlink, div, span, component, svg, div, div, div, div, div, div, div, div, div, div, div, div, legalarticle, div, legalarticle, legalarticle, div, div, div, footer, header, svg, div, div, div, svg, svg, svg, article, section, svg, icon, panelcard, div, div, div, span, svg, div, svg, svg, section, section, section, section, li, launchstep, panelcard, svg, section, launchstep, div, footer, div, section, article, li, article, svg, nav, svg, section, span, section, section, section, panelcard, section, div, routerlink, div, span, routerlink, a, button, svg, div, div, div, div, div, div, div, div, div, div, div, div, legalarticle, div, legalarticle, legalarticle, div, div

The replacement skeleton must not be `orbital` and must not be in the same family (`spatial`).

## Routes

- `/`
- `/about`
- `/account`
- `/challenges`
- `/challenges/:slug` _(dynamic)_
- `/challenges/ecdsa-fail`
- `/challenges/proximity`
- `/challenges/sig-golf`
- `/exposure`
- `/launch`
- `/privacy`
- `/q-day`
- `/risks`
- `/t/:mint` _(dynamic)_
- `/t/preview`
- `/terms`
- `/tokens`

## Palette (most used first)

`#000000` (10) · `#ffffff` (8) · `#0b0d10` (5) · `#0a0b0d` (4) · `#0000ff` (2) · `#181b20` (2) · `#b9baff` (2) · `#c9cfff` (2) · `#0b6b47` (1) · `#0f2a20` (1)

## Content lock

- Static visible text tokens: **683**
- Binding expressions: **970**
- Event handlers: **59**
- Contract hash: `a48cf00f0516d7c322db0d0774f25f96ad9b4e081c9132cebd4d333f9f939463`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/mathlana/website" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/mathlana/website" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
