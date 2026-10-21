<script setup>
/**
 * Shared shell for the three legal documents (`/terms`, `/privacy`, `/risks`).
 *
 * The document is presented as a filing plate: a very large running head, one
 * mono metadata line, a horizontal document index, then the numbered clauses in
 * a single ruled column with an index gutter.
 */
import { RouterLink } from "vue-router";

defineProps({
  title: { type: String, required: true },
  /** Key of the page being viewed: "terms" | "privacy" | "risks". */
  current: { type: String, required: true },
  eyebrow: { type: String, default: "Legal" },
  updated: { type: String, default: "Last updated October 10, 2026" },
});

const PAGES = [
  { key: "terms", label: "Terms", to: "/terms" },
  { key: "privacy", label: "Privacy", to: "/privacy" },
  { key: "risks", label: "Risks", to: "/risks" },
];
</script>

<template>
  <article class="cq-page cq-doc">
    <div class="cq-pagehead cq-doc__head" role="presentation">
      <div class="cq-pagehead__head">
        <p class="cq-kicker cq-doc__eyebrow">{{ eyebrow }}</p>
        <h1 class="cq-runhead cq-doc__title">{{ title }}</h1>
      </div>

      <div class="cq-pagehead__edge cq-doc__headedge">
        <p class="cq-eyebrow cq-doc__stamp">{{ updated }}</p>
        <span aria-hidden="true" class="cq-doc__edgemark" />
      </div>
    </div>

    <div class="cq-stage cq-doc__stage">
      <div class="cq-stage__main">
        <div class="cq-sheet cq-doc__document">
          <ol class="cq-doc__clauses">
            <slot />
          </ol>
        </div>
      </div>

      <div class="cq-stage__edge cq-doc__edge">
        <span aria-hidden="true" class="cq-doc__edge-mark" />
        <nav aria-label="Legal pages" class="cq-doc__nav">
          <RouterLink
            v-for="page in PAGES"
            :key="page.key"
            :to="page.to"
            :aria-current="page.key === current ? 'page' : undefined"
            class="cq-doc__nav-link"
            :class="page.key === current ? 'cq-doc__nav-link--current' : ''"
          >
            <span class="cq-doc__nav-mark" aria-hidden="true" />
            <span class="cq-doc__nav-label">{{ page.label }}</span>
          </RouterLink>
        </nav>
      </div>
    </div>
  </article>
</template>

<style scoped>
.cq-doc {
  padding-bottom: clamp(28px, 4vw, 56px);
}

/* running head -------------------------------------------------------- */
.cq-doc__head {
  align-items: end;
}

.cq-doc__title {
  max-width: 12ch;
  margin-top: 10px;
  font-size: clamp(52px, 10vw, 132px);
  line-height: 0.84;
  letter-spacing: -0.06em;
  overflow-wrap: anywhere;
}

.cq-doc__headedge {
  align-items: flex-start;
  padding-bottom: 10px;
}

.cq-doc__stamp {
  margin: 0;
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cq-muted);
}

.cq-doc__edgemark {
  position: relative;
  display: block;
  width: 34px;
  height: 34px;
  margin-top: 6px;
  border-top: 1px solid var(--cq-accent);
  border-right: 1px solid var(--cq-accent);
  opacity: 0.7;
}

.cq-doc__edgemark::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 8px;
  height: 1px;
  background: var(--cq-accent);
}

/* document stage ------------------------------------------------------ */
.cq-doc__stage {
  margin-top: clamp(2px, 0.6vw, 8px);
}

.cq-doc__document {
  min-width: 0;
  overflow: clip;
}

.cq-doc__clauses {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* contents edge ------------------------------------------------------- */
.cq-doc__edge {
  gap: 14px;
  position: sticky;
  top: 96px;
  align-self: start;
}

.cq-doc__edge-mark {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--cq-line);
}

.cq-doc__nav {
  display: grid;
  gap: 0;
  min-width: 0;
}

.cq-doc__nav-link {
  position: relative;
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 11px 2px;
  border-bottom: 1px solid var(--cq-line-soft);
  font-family: var(--cq-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cq-muted);
  transition: color var(--cq-fast) var(--cq-ease), border-color var(--cq-fast) var(--cq-ease);
}

.cq-doc__nav-link:hover,
.cq-doc__nav-link:focus-visible {
  color: var(--cq-ink);
  border-bottom-color: var(--cq-line-strong);
}

.cq-doc__nav-mark {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border: 1px solid currentColor;
  rotate: 45deg;
  opacity: 0.6;
}

.cq-doc__nav-link--current {
  color: var(--cq-accent-text);
}

.cq-doc__nav-link--current::before {
  content: "";
  position: absolute;
  left: -10px;
  top: 50%;
  width: 3px;
  height: 16px;
  translate: 0 -50%;
  background: var(--cq-accent);
}

.cq-doc__nav-link--current .cq-doc__nav-mark {
  background: currentColor;
  opacity: 1;
}

.cq-doc__nav-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

@media (max-width: 960px) {
  .cq-doc__headedge {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .cq-doc__edgemark {
    margin-top: 0;
  }

  .cq-doc__edge {
    position: static;
  }

  .cq-doc__nav {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-top: 1px solid var(--cq-line);
  }

  .cq-doc__nav-link {
    border-bottom: 0;
    padding: 12px 10px;
  }

  .cq-doc__nav-link--current::before {
    left: 0;
    top: 0;
    width: 100%;
    height: 2px;
    translate: none;
  }
}

@media (max-width: 560px) {
  .cq-doc__title {
    font-size: clamp(44px, 16vw, 72px);
  }

  .cq-doc__nav-link {
    padding: 11px 6px;
    font-size: 0.62rem;
    letter-spacing: 0.08em;
  }
}
</style>
