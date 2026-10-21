# Reskin report — Qubitess website + X kit

## Direction

| Field | Value |
|---|---|
| Style | **Cobalt Blueprint** (`base-cobalt`, optimistic-modern) — source DNA: [base.org](https://www.base.org), live-sampled (3258 ms) |
| Skeleton | **Command Rail** (`command-rail`, linear) — original was `orbital` (spatial) |
| Accent | original `#6f82e8` → rendered accent `#4d5bff` / fill `#0000ff` (**39.74 ΔE**, min 30) |
| Ground | warm paper `#efebe1` sheets and ink rules → blueprint grey `#dde3e9` with a 32 px module grid |
| Type | Montserrat 620 display with −0.035 em tracking, DM Sans body, JetBrains Mono micro-labels |
| Material | 18–30 px white sheets, hairline borders, soft shadows, cobalt fills, mono numerals |
| Content contract | baseline `e541eab07197` — **intact** (0 removals; 2 additive binding warnings) |
| Current source hash | `e9add1f651ae…` |

Live sampling reached 9/10 blockchain references (Arbitrum returned 403). Only palette, type
mood, shape language, density and motion were taken; no reference logo, illustration, copy or
code was used.

## Skeleton — what replaced what

| Original (paper / documentary) | New (cobalt / command rail) |
|---|---|
| Static masthead across the top, serif running head | **Floating command bar**, detached 16 px from the edge, radius 30, blur, with the lockup, a 4-segment meter and the actions |
| Ruled route index line under the masthead | **Fixed 76 px glyph rail** on the left: icon + rotated mono micro-label per route, cobalt active plate |
| Right margin "contents" column (`aside`) with hidden labels | Rail replaces it; under 960 px a **fixed bottom dock** with the same five labelled glyphs |
| Live ticker as a dateline under the header | **Dark stdout strip** fixed to the bottom edge, mono, five machines, no page flow impact |
| Cream ruled paper, flat sheets, 2 px ink rules, square marks | **Blueprint grey with a 32 px grid**, white sheets with 18 px corners, 1 px hairlines, soft shadows, registration ticks |
| Serif running heads, typewriter labels, marginalia | **Montserrat running heads** at 76 px, mono kickers with a cobalt rule, right-edge lede column |
| `header → nav(index) → main → aside → nav(primary) → footer` | `nav(rail) → nav(dock) → header(command bar) → main → footer` plus the stdout strip |
| `paper.css` (`pp_*` tokens, `pp-*` classes) | `rail.css` (component grammar, `cq-*`) + `shell.css` (the new skeleton); `paper.css` archived, not imported |

Page composition is now a **running head + data stage**: `.cq-pagehead` (head: kicker + running
head; edge: lede + actions), then `.cq-stage` with a wide main column and a narrow marginal
column, plus `.cq-band` dark plates for figures and CTAs.

Per route: `/` running head + edge lede + figure plate with machine chips + three ruled capability
columns; `/tokens` figures band + official identity sheet + token ledger, research log in the
margin; `/t/:mint` pagehead + token facts + ledger sheets, pool/fee/picture in the margin;
`/challenges` group sheets with dark group bands and numbered ledger rows; `/challenges/:slug`
running head + metric sheets, stakes as a dark band in the margin; `/q-day` dark clock band +
public-record sheet, brief sticky in the margin, ladder/hardware/rules as ruled sections;
`/launch` numbered questionnaire with the picker, preview and fee split in a sticky margin;
`/exposure` dark form plate + legend sheet; legal routes as a document plate with a marginal
contents nav; `/about` editorial stage; `/account` and 404 as centred plates.

## Verification

Command (deterministic data harness — see limitations):

```bash
node "<reskin>/scripts/verify.mjs" check --project . --out .reskin \
  --url http://127.0.0.1:4498 --no-build
```

**Verdict: every rendered, structural, content, accessibility and responsive gate passes on all
15 static routes. The one blocking item is the source archetype heuristic, which cannot pass
while the frozen content contract locks the identifiers it reads (limitation 1).**

| Gate | Result |
|---|---|
| Production build | PASS (`vite build`, 157 modules) |
| Source content contract | PASS — 0 removals, 2 additive binding warnings |
| Route status / console / page errors | PASS — 15/15 HTTP 200, 0 errors |
| Rendered word/attribute parity | PASS — 0 content diffs; word counts identical per route |
| DOM fingerprint similarity (≤0.50) | PASS — **0.246–0.462** |
| Landmark similarity (≤0.68) | PASS — **0.333–0.667** |
| CSS class overlap (≤0.10) | PASS — **0.044–0.085** |
| Accent distance (≥30 ΔE) | PASS — **39.74 ΔE** |
| Contrast (0 failures) | PASS — 0 across 36–173 text/background pairs per route, both viewports |
| axe serious/critical (0) | PASS — 0 on all routes |
| Labels, alt text, accessible names | PASS |
| Keyboard focus visibility | PASS |
| Mobile navigation reachability | PASS — dock links reachable and labelled |
| Horizontal overflow at 390 px | PASS — none on any route |
| Skeleton archetype changed (source heuristic) | **FAIL — structurally unreachable (limitation 1)** |

Final record: `.reskin/verification.json`, `.reskin/VERIFICATION.md`.

### Screenshots (baseline → current)

Baseline is the pre-reskin paper UI, recovered and proven by hash (see limitations); current is
the cobalt build. Files: `.reskin/baseline/*.png` and `.reskin/current/*.png`.

| Route | Baseline | Current |
|---|---|---|
| `/` | [home-desktop](baseline/home-desktop.png) | [home-desktop](current/home-desktop.png) |
| `/tokens` | [tokens-desktop](baseline/tokens-desktop.png) | [tokens-desktop](current/tokens-desktop.png) |
| `/challenges` | [challenges-desktop](baseline/challenges-desktop.png) | [challenges-desktop](current/challenges-desktop.png) |
| `/challenges/sig-golf` | [sig-golf](baseline/challenges-sig-golf-desktop.png) | [sig-golf](current/challenges-sig-golf-desktop.png) |
| `/q-day` | [q-day-desktop](baseline/q-day-desktop.png) | [q-day-desktop](current/q-day-desktop.png) |
| `/launch` | [launch-desktop](baseline/launch-desktop.png) | [launch-desktop](current/launch-desktop.png) |
| `/exposure` | [exposure-desktop](baseline/exposure-desktop.png) | [exposure-desktop](current/exposure-desktop.png) |
| `/about` | [about-desktop](baseline/about-desktop.png) | [about-desktop](current/about-desktop.png) |
| `/terms` | [terms-desktop](baseline/terms-desktop.png) | [terms-desktop](current/terms-desktop.png) |
| `/account` | [account-desktop](baseline/account-desktop.png) | [account-desktop](current/account-desktop.png) |

Mobile captures are the matching `*-mobile.png` files. The dark edition was checked visually
(`.reskin/preview/dark-home.png`), including the filled-button contrast the first pass broke.

**Visual originality review.** Baseline and current share no shell silhouette: navigation moved
from a top masthead plus right-margin column to a left glyph rail (and a bottom dock on phones);
the page opens with a floating command bar, not a ruled masthead; the live feed dropped from a
dated dateline to a fixed dark stdout strip; the ground changed from warm ruled paper to cool
blueprint grey with a module grid; cards became hairline sheets with 18 px corners; the type
moved from serif running heads to tightened Montserrat; the accent moved from periwinkle to
cobalt. The first viewport has a different reading path (rail → command bar → running head →
edge lede → figure plate), and every data route is a stage/ledger rather than a card grid.

## Changes

New:
- `src/styles/rail.css` — component grammar (tokens + `cq-*` classes, light and night editions,
  reduced-motion guards, breakpoints).
- `src/styles/shell.css` — the Command Rail skeleton: rail, dock, command bar, stdout strip,
  colophon, pageheads, stage grid, blueprint surfaces, primitives, responsive layer.
- `src/components/shell/CommandRail.vue`, `CommandDock.vue`, `CommandBar.vue`, `Colophon.vue`.
- `.reskin/tools/` — deterministic serve harness, screenshot/dark helpers, the namespace
  transform, the baseline reconstruction, the asset scripts.

Rewritten in place (templates, presentation-only script edits; all content tokens kept): the home
hero, threat panels, how-it-works and exposure banner; every tokens, challenges, q-day, launch,
exposure, legal, about, account and 404 view and component; `App.vue`; the shell markup.

Removed from the render path: `components/layout/AppHeader.vue`, `components/layout/AppFooter.vue`,
`components/rail/AppRail.vue`, `styles/paper.css` (archived at `.reskin/removed/paper.css`). No
`pp-*` class or `--pp-*` token remains under `src/`.

X kit (`twitter/`): `src/base.css` re-themed to the blueprint tokens; `src/logo.html`,
`src/banner.html` and `src/tweet.html` rebuilt; `logo.png`, `banner.png` and `tweet.png`
re-rendered at 400×400 / 1500×500 / 1600×900; `README.md` and the alt text in `tweet.md` updated
to describe what ships.

## Accessibility and responsiveness

- One `h1` per route; `nav`, `header`, `main`, `footer` landmarks; visually-hidden skip link that
  becomes visible on focus.
- All inputs labelled; icon-only controls carry accessible names (rail and dock links keep their
  route label as the accessible name and as visible rotated/docked text).
- Visible focus ring on every control; no `outline: none` without a replacement.
- Contrast: 0 failures on every route at both viewports; body text ≥ 4.5:1.
- No horizontal overflow at 390 px; the dock linearises navigation, the stage becomes one column,
  ledgers reflow, the stdout strip scrolls its machines.
- Motion is inside `@media (prefers-reduced-motion: no-preference)`.
- Night edition: ink ground, cobalt fills, lightened text; filled buttons switch to cobalt/white
  (the first pass shipped white-on-white and was fixed) and the hero engraving inverts.

## Known limitations

1. **The archetype gate cannot pass.** `classifyArchetype()` scans source text for `\borbital\b` /
   `\borbit\b` and tests `orbital` first. The frozen content contract requires
   `v-html="ORBITAL"` (2 bindings) in `ChallengeIcon.vue` and `name="orbit"` (2 attributes) in
   `PoolPanel.vue` / `AboutView.vue`; renaming or removing either is a content-contract failure
   ("bindings removed" / "attributes removed"), and keeping them keeps the source-classified
   archetype at `orbital`. The rendered evidence contradicts the heuristic: DOM fingerprint
   ≤ 0.462, landmark similarity ≤ 0.667, class overlap ≤ 0.085, and the screenshots show a
   different shell. The previous reskin hit the same block.
2. **Baseline recovery.** `verify.mjs baseline` was not captured before the first edit. The
   pre-reskin site was reconstructed in `mathlana-baseline/` from the rebrand backup taken minutes
   earlier (91 files), re-applying the same brand mapping and manual wordmark corrections, and
   verified by content contract: the reconstruction produces hash **`e541eab07197`**, identical to
   the frozen baseline contract. Baseline pages and screenshots were captured from that
   reconstruction and copied into `.reskin/baseline/`.
3. **Deterministic data.** The site reads `/api/market` and `/api/quantum/status`. Prices move
   between captures (the first run differed by `$5.1K` → `$4.7K` on `/tokens`), so the final
   capture used `.reskin/tools/serve.mjs`: market pinned to the app's built-in snapshot
   (`{tokens:{}}`), quantum status from `.reskin/quantum-cache.json`, everything else proxied.
   Baseline and current were captured through the same harness.
4. Dynamic routes `/t/:mint` and `/challenges/:slug` are not captured by the verifier (no fixture);
   they were checked by hand at 1440 and 390, including their not-found branches.
5. Decorative group/row numbers on `/challenges` are CSS counters, not text nodes; they are
   design furniture, not copy.

## Commit statement

The UI was rebuilt around **Cobalt Blueprint** / **Command Rail**; the original **orbital** shell
and palette were removed while the content contract stayed byte-for-byte intact.
