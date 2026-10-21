# Wireframe — Paper Protocol / Documentary Ledger

Style: `ethereum-paper` (Paper Protocol) · Skeleton: `documentary` (Documentary
Ledger) · Original: `orbital` / spatial.

## The new shell

There is no fixed rail and no floating command bar. Every route is a page of a
printed research journal:

```
<div class="pp-paper">
  <a class="pp-skip sr-only" href="#main">Skip to content</a>
  <AppHeader />                     → <header class="pp-masthead">
                                        wordmark + actions
                                        <nav class="pp-indexbar"> route index line
                                        mobile sheet (v-if)
  <QuantumTicker />                 → <section class="pp-wire"> live dateline
  <div class="pp-shell">
    <main id="main" class="pp-main"><RouterView /></main>
    <aside class="pp-contents">     ← after main in DOM, placed in the outer grid
      <AppRail />                   → <nav aria-label="Primary"> glyph index
    </aside>
  </div>
  <AppFooter />                     → <footer class="pp-colophon">
</div>
```

- Landmarks in DOM order: `header → nav (index) → main → aside → nav (contents) → footer`;
  the old order was `main → nav (fixed rail) → footer`.
- The masthead is static, not sticky. The live quantum readout is a thin ruled
  dateline (`pp-wire`) under the index line, not a strip above the footer, and not
  inside the header actions.
- The marginal contents column is static/sticky-in-place in the outer grid; at
  ≤1020px it moves under `main` and becomes a labelled horizontal index. It is not
  a fixed sidebar and it is not a drawer.
- The footer is a colophon: double rule, imprint, Product and Legal indexes,
  theme switch, fine print.

## Route compositions (all paper, ruled, serif)

| Route | Composition |
|---|---|
| `/` | Front page: kicker + two-line running head, lede paragraphs, machine chips, ruled action row; three "departments" (cards) as a ruled triptych; two threat panels as letterpress ledgers; exposure notice as a ruled callout; four numbered steps as a horizontal rule list. |
| `/tokens` | Running head + figures ruled strip; pinned official token on an identity band with figures beneath; filter tabs as underlines; token ledger rows (lead / status / figures / curve / mission); research log in the margin column. |
| `/t/:mint` | Specimen page: running head, specimen picture margin, data sheet and token ledger. |
| `/challenges` | Numbered group index (square marks), each threat family as an article with a ruled group head and challenge ledger rows. |
| `/challenges/:slug` | Masthead with host/verb, brief in two columns, engraving plate at the right; metric sheet with margin facts; stake ledger; tokens on a full-width row. |
| `/q-day` | Clock page: running head, huge serif clock figure, public-record margin, ladder as ruled rungs, rules as a two-column numbered list. |
| `/launch` | Questionnaire: numbered command steps with rules, underline fields, challenge radio ledger, pinned specimen/preview/fee rail. |
| `/exposure` | Front-page form: running head, wallet field as a typeset box, "what the answer can be" triptych, chain notes in three columns; results in the same grammar. |
| `/about` | Editorial: running head + lede, two threat articles, machine roster, three numbered steps, calm response / not-promised close. |
| `/terms`, `/privacy`, `/risks` | Document plate: oversized title, mono meta line, underline tab index, numbered clauses on the sheet. |
| `/account` | Empty-state plate: folio, running head, ruled plate with art, facts in the margin, sign-in dialog as a paper slip. |
| `*` | Not-found plate. |

## Files

- New token/layout layer: `src/styles/paper.css` (replaces `src/styles/cobalt.css`,
  which is deleted; imported from `src/main.js`).
- Rewritten shell: `src/App.vue`, `components/layout/AppHeader.vue`,
  `components/rail/AppRail.vue`, `components/layout/QuantumTicker.vue`,
  `components/layout/AppFooter.vue`.
- Restyled presentation (in place, content preserved): launch step/picker/portrait/
  preview/fee panels, token ledger and official row, challenge cards/hero/metrics/
  stakes, q-day ladder, legal article/sections, exposure banner and results, account
  plate, about page, home hero/threats/how-it-works.
- No old class name or `--cr-*` token remains in `src/`.

## Class/token namespace

- CSS custom properties: `--pp-*` (paper, sheet, ink, line, accent, live, warn, note,
  display/body/mono, radius 0–3px, shadow none, paper rhythm).
- Classes: `pp-*` only. Framework-provided `sr-only`, `is-pressed`, `router-link-active`
  are the only shared names with the old build.
- Type: Palatino/Iowan serif display and Georgia running text; Courier New for
  micro-labels, figures and folios.

## Breakpoints

- 1180px: two-column stages collapse; margins reflow under the running column;
  launch rail moves under the form.
- 1020px: marginal contents becomes a horizontal labelled index under `main`;
  main content goes full width.
- 900px: masthead CTA hides (kept in the sheet), menu button appears.
- 760px: token ledger becomes a single stacked row; about/exposure stacks.
- 560px: index line wraps/scrolls, figures become a two-column grid, colophon
  becomes one column.
