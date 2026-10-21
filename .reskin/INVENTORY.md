# Reskin inventory — qubitess-website

Generated: 2026-10-21T17:07:06.791Z

## Project

| Field | Value |
|---|---|
| Root | `E:/workspace/chuangye/solana/mathlana/website` |
| Vue | ^3.5.13 |
| Package manager | pnpm |
| Nuxt | no |
| CSS frameworks | @tailwindcss/vite, tailwindcss |
| Files scanned | 83 (66 SFCs) |

## Original skeleton

- Archetype: **orbital** (spatial)
- Traits: sidebar, cards, hero, table, grid, tabs, modal, sticky, orbital, ticker
- Max template depth: 9
- Top-level tags: div, div, svg, svg, svg, article, section, svg, icon, panelcard, div, div, div, span, svg, div, svg, svg, section, section, section, section, li, launchstep, panelcard, svg, section, launchstep, div, footer, header, section, article, li, article, svg, nav, svg, section, span, section, section, section, panelcard, section, div, routerlink, div, span, routerlink, a, button, svg, div, div, div, div, div, div, div, div, div, div, div, div, legalarticle, div, legalarticle, legalarticle, div, div

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

`#000000` (8) · `#171610` (6) · `#ffffff` (6) · `#c9d0ff` (2) · `#0a0b0d` (1) · `#100f0a` (1) · `#131209` (1) · `#15140f` (1) · `#15261d` (1) · `#1b1a13` (1)

## Content lock

- Static visible text tokens: **329**
- Binding expressions: **476**
- Event handlers: **24**
- Contract hash: `e541eab0719710f76f45f67f112035e2b72f97ffe8a5465a993a37d10effdee6`

Everything in `.reskin/content-contract.json` is immutable: visible copy, placeholders, labels, routes, link targets, asset sources, bindings, handlers, API endpoints and i18n values. A reskin may move these tokens to new markup but may not rewrite, remove or hide them.

## Next

```bash
node scripts/choose-style.mjs --project "E:/workspace/chuangye/solana/mathlana/website" --out .reskin
node scripts/verify.mjs baseline --project "E:/workspace/chuangye/solana/mathlana/website" --out .reskin
```

Then rewrite the UI and run `verify.mjs check`.
