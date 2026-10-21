# Reskin report — Qubitlane website

## Direction

| Field | Value |
|---|---|
| Style | **Paper Protocol** (`ethereum-paper`, crypto-editorial) — source DNA: [ethereum.org](https://ethereum.org) (live sampling timed out; offline catalog used) |
| Skeleton | **Documentary Ledger** (`documentary`, editorial) — original was `orbital` (spatial) |
| Accent | `#0000ff` → `#6f82e8` in the palette gate (**82.95 ΔE**, min 30); light edition uses `#4c63d2`, night edition `#6f82e8`, text-safe `#3d51b8` / `#a9b6ff` |
| Ground | blueprint grey/white cards → warm newsprint `#efebe1`, paper sheets, ink rules |
| Type | Iowan Old Style / Palatino / Georgia running text; Courier New micro-labels and figures |
| Content contract | frozen `a48cf00f0516d7c322db0d0774f25f96ad9b4e081c9132cebd4d333f9f939463` — **intact** (0 removals, 3 additive binding warnings) |

The selected direction is used as an abstract design DNA only. No reference
logo, illustration, copy or code was reused; the only imagery is the project's own
`/brand/*.png` engravings.

## Skeleton: what replaced what

| Original (cobalt / orbital) | New (paper / documentary) |
|---|---|
| Fixed 76px glyph rail on the left; vertical mono labels | **Masthead** across the top: serif wordmark, actions, and a ruled route **index line**; no rail, no fixed spine |
| Floating sticky pill command bar over the page | Static masthead; the same actions sit on the masthead's first line |
| Live quantum ticker above the footer | Thin ruled **live dateline** directly under the masthead index |
| Full-bleed blue-grey grid canvas, white rounded cards | Cream **ruled paper**, flat sheets, 2px ink rules, square marks, no cards or shadows |
| Sans running heads, rounded pills, tinted chips | Serif front-page running heads, square underlined tabs, typewriter micro-labels, marginalia |
| `main → nav (rail) → footer` landmark order | `header → nav (index) → main → aside (contents) → nav (primary) → footer` |
| Tailwind-derived `cr-*` classes and cobalt tokens | One stylesheet `src/styles/paper.css`, `--pp-*` tokens and `pp-*` classes only |

Per-route composition: `/` front page (two-line running head, ruled action row,
departments triptych, threat ledgers, exposure notice, numbered steps); `/tokens`
figures strip + pinned official identity band + token ledger + research-log margin;
`/t/:mint` specimen sheet; `/challenges` numbered group index and ruled challenge
rows; `/challenges/:slug` masthead + engraving plate + metric sheet + stake ledger;
`/q-day` clock page with ladder rungs; `/launch` numbered questionnaire with a pinned
specimen/fee rail; `/exposure` front-page form with a "what the answer can be"
triptych; `/about` editorial; legal routes as document plates with underline tabs;
`/account` and 404 as ruled plates.

## Verification

Command used for the final run (deterministic data harness, see limitations):

```bash
node "<reskin>/scripts/verify.mjs" check --project . --out .reskin \
  --url http://127.0.0.1:4499/
```

**Verdict: every rendered, structural, content, accessibility and responsive gate
passes on all 15 static routes. One source gate — the archetype heuristic — is
unreachable because the content contract locks the exact identifiers that the
heuristic reads (see limitation 1).**

| Gate | Result |
|---|---|
| Production build (`vite build`) | PASS (built in checkpoint 2; manual final build exit 0) |
| Source content contract | **PASS** — 0 removals; 3 additive binding warnings (`item.to`, `item.label` from the masthead index) |
| Route status / console / page errors | PASS — 15/15 HTTP 200, 0 console or page errors |
| DOM fingerprint similarity (≤ 0.50) | PASS — **0.299–0.452** |
| Landmark similarity (≤ 0.68) | PASS — **0.50–0.571** |
| CSS class overlap (≤ 0.10) | PASS — **0.043–0.092** |
| Accent distance (≥ 30 ΔE) | PASS — **82.95 ΔE** |
| Rendered word/attribute parity | PASS — 0 content diffs on all static routes |
| Contrast (0 failures) | PASS — 0 failures across 137–173 text/background pairs per route |
| axe serious/critical (0) | PASS — 0 on all routes |
| Labels, alt text, accessible names | PASS |
| Keyboard focus visibility | PASS |
| Mobile navigation reachability | PASS |
| Horizontal overflow at 390px | PASS |
| Skeleton archetype changed | **FAIL (unreachable — limitation 1)** |

Baseline content contract: `a48cf00f0516...`; current-build contract hash
`32e21d29b635...` (differs only by the three additive nav bindings). Frozen baseline
inventory and contract are unchanged in `.reskin/baseline/`.

### Deterministic verification harness

The site polls a live market feed (`/api/market`) and quantum status
(`/api/quantum/status`). Between captures the market API is intermittent, and the
original baseline was captured with fallback market snapshots while other routes
had live values — internally inconsistent data. To make the content gate meaningful,
the final capture used the app's own built-in fallback state:

- `/api/market` returns `{ tokens: {} }`, so every token renders the snapshot baked
  into `src/data/tokens.js` (the same state the first baseline was captured in);
- `/api/quantum/status` is served from a cached live response
  (`.reskin/quantum-cache.json`), so the dateline is identical in both captures;
- all other `/api/*` requests are proxied to the live origin;
- the app code and the production build are unchanged.

The baseline pages were recaptured from the archived pre-reskin source snapshot
(`.reskin-history/cobalt-20261020/src-snapshot`, the same recovery pattern the skill
prescribes for a missing baseline) using this harness. The baseline inventory itself
is the original pre-reskin inventory with the `a48cf00f...` contract. The original
live baseline capture is preserved in `.reskin-history/baseline-live-20261020/`.
Without the harness, the same build fails only on volatile market/quantum values
(the live-feed checkpoint reported 7 value-token diffs on `/tokens` and 1 on
`/challenges/sig-golf`, plus two ticker-word diffs when the quantum API returned
502); no copy, label or structural difference remains.

## Screenshots

Baseline → current (1440 × full page). Baseline is the cobalt pre-reskin UI
recaptured from the archived source; current is the paper build.

| Route | Baseline | Current |
|---|---|---|
| `/` | [baseline/home-desktop.png](baseline/home-desktop.png) | [current/home-desktop.png](current/home-desktop.png) |
| `/tokens` | [baseline/tokens-desktop.png](baseline/tokens-desktop.png) | [current/tokens-desktop.png](current/tokens-desktop.png) |
| `/challenges` | [baseline/challenges-desktop.png](baseline/challenges-desktop.png) | [current/challenges-desktop.png](current/challenges-desktop.png) |
| `/challenges/sig-golf` | [baseline/challenges-sig-golf-desktop.png](baseline/challenges-sig-golf-desktop.png) | [current/challenges-sig-golf-desktop.png](current/challenges-sig-golf-desktop.png) |
| `/q-day` | [baseline/q-day-desktop.png](baseline/q-day-desktop.png) | [current/q-day-desktop.png](current/q-day-desktop.png) |
| `/launch` | [baseline/launch-desktop.png](baseline/launch-desktop.png) | [current/launch-desktop.png](current/launch-desktop.png) |
| `/exposure` | [baseline/exposure-desktop.png](baseline/exposure-desktop.png) | [current/exposure-desktop.png](current/exposure-desktop.png) |
| `/about` | [baseline/about-desktop.png](baseline/about-desktop.png) | [current/about-desktop.png](current/about-desktop.png) |
| `/terms` | [baseline/terms-desktop.png](baseline/terms-desktop.png) | [current/terms-desktop.png](current/terms-desktop.png) |
| `/account` | [baseline/account-desktop.png](baseline/account-desktop.png) | [current/account-desktop.png](current/account-desktop.png) |

Mobile captures: `baseline/*-mobile.png` vs `current/*-mobile.png`. Extra review
captures (dark edition) live in `.reskin/preview/*-dark.png`.

**Visual originality review.** Baseline and current share no shell silhouette: the
navigation moved from a fixed left icon rail plus floating pill (top) to a ruled
masthead index and a right margin glyph index; the live strip moved from above the
footer to a dateline; the page title changed from sans poster to serif front-page
running head; cards became rules and ledgers; the blue-grey grid became lined cream
paper. The first viewport has a different reading path (masthead index line →
running head → lede → engraving), and the accent family is periwinkle, not pure
cobalt. The data route is a ruled ledger in both (the content demands tabular
figures) but its cells, typography, filters and margins are rebuilt.

## Changes

New:
- `src/styles/paper.css` — the single token/layout/component layer (`--pp-*`, `pp-*`,
  light + night edition, reduced-motion guards, breakpoints 1180/1020/900/760/560).
- Documentary shell inside `App.vue`: masthead + index, live wire, main + marginal
  contents aside, colophon.
- `.reskin/serve-dist.mjs` and `.reskin/quantum-cache.json` — verification-only
  deterministic data harness (not part of the website).

Rewritten in place (templates, styles, presentation-only script tweaks; all content
tokens kept): `AppHeader`, `AppRail`, `QuantumTicker`, `AppFooter`; the launch step,
challenge picker, quantum portrait step, token preview and fee split; the token
ledger/official row/research log; the challenge card/hero/metric/stakes components;
the q-day ladder; the legal article and clauses; the exposure banner/results; the
account plate; the about page; the home hero/threat panels/how-it-works; all 14 view
files. All `cr-*` classes and `--cr-*` tokens were renamed and restyled to `pp-*`.

Removed from the render path (and from disk where no content depended on them):
`src/styles/cobalt.css`, the fixed rail CSS, the floating command bar, the bottom
status strip and the old card/sheet surfaces. No `cr-*` class or `--cr-*` token
remains under `src/`.

Kept byte-for-byte in the content contract: all visible copy, interpolations,
content bindings (`:to/:href/:src/:alt/:title/:name/:value/:placeholder`), event
handlers, form fields/options, link targets, assets, `lang`, meta title/description
and the router. The only source additions are three presentational nav bindings
(`:to="item.to"` / `{{ item.label }}` in the new index) reported as warnings.

## Accessibility and responsiveness

- One `h1` per route; `header`, `nav`, `main`, `aside`, `footer` landmarks; skip link.
- All inputs labelled; icon-only controls carry accessible names (`aria-label` where
  the label is not visible); dialog keeps `role="dialog"`, `aria-modal`, labelled
  title and Escape/close affordance (unchanged behaviour).
- Visible focus ring on every control; no `outline: none` without a replacement.
- Contrast: **0 failures** on every route × both viewports; body text ≥ 4.5:1.
- No horizontal overflow at 390px; the index line wraps or scrolls, the marginal
  contents becomes a labelled horizontal index, ledgers reflow to single rows.
- Motion is inside `@media (prefers-reduced-motion: no-preference)`.
- Night edition retained: ink paper, cream ink, periwinkle engraving and accent text
  adjusted for contrast (verified visually; the automated gate runs the default
  light theme).

## Known limitations

1. **The archetype gate cannot pass.** `classifyArchetype()` scans the source text
   for `\borbital\b` / `\borbit\b`. The frozen content contract locks
   `v-html="ORBITAL"` (count 2) in `ChallengeIcon.vue` and `name="orbit"` (count 4)
   on the decorative `CardArt` usage. Removing or renaming those identifiers is a
   content-contract failure; keeping them keeps the source-classified archetype at
   `orbital`. This is a property of the checker reading code identifiers as layout
   evidence, not of the rendered UI: the DOM fingerprint (≤ 0.452), landmark order
   (≤ 0.571), class overlap (≤ 0.092) and screenshots all show a different shell.
   The baseline report from the previous run hit the same block.
2. Dynamic routes `/t/:mint` and `/challenges/:slug` are not captured by the
   verifier (no fixture). They were checked by hand at 1440 and 390, including the
   not-found branches.
3. Live data: the final gate pins the market feed to the app's built-in fallback
   snapshots and the quantum status to one cached live response; with the raw live
   feed the same build differs only in volatile values. See "Deterministic
   verification harness".
4. The baseline was recaptured from the archived pre-reskin source snapshot with the
   same harness; the original live capture is kept under
   `.reskin-history/baseline-live-20261020/`. The baseline inventory and content
   contract were not altered.

## Commit statement

The UI was rebuilt around **Paper Protocol** / **Documentary Ledger**; the original
**orbital** shell and palette were removed while the content contract stayed
byte-for-byte intact. The one unreachable gate is the source-text archetype
heuristic documented above.
