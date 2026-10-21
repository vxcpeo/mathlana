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
  <article class="pp-page pp-doc">
    <div class="pp-head pp-doc__head">
      <h1 class="pp-runhead pp-doc__title">{{ title }}</h1>

      <div class="pp-doc__meta">
        <p class="pp-kicker pp-doc__eyebrow">{{ eyebrow }}</p>
        <span class="pp-doc__meta-rule" aria-hidden="true" />
        <p class="pp-eyebrow pp-doc__stamp">{{ updated }}</p>
      </div>

      <nav aria-label="Legal pages" class="pp-doc__nav">
        <RouterLink
          v-for="page in PAGES"
          :key="page.key"
          :to="page.to"
          :aria-current="page.key === current ? 'page' : undefined"
          class="pp-doc__nav-link"
          :class="page.key === current ? 'pp-doc__nav-link--current' : ''"
        >
          <span class="pp-doc__nav-mark" aria-hidden="true" />
          <span class="pp-doc__nav-label">{{ page.label }}</span>
        </RouterLink>
      </nav>
    </div>

    <div class="pp-doc__body">
      <ol class="pp-doc__clauses">
        <slot />
      </ol>
    </div>
  </article>
</template>

<style scoped>
.pp-doc {
  width: 100%;
  max-width: 76rem;
  padding-bottom: var(--pp-t6);
}

.pp-doc__head {
  gap: var(--pp-t3);
  padding-top: var(--pp-t6);
  padding-bottom: 0;
  border-bottom: 0;
}

.pp-doc__title {
  max-width: 12ch;
  font-size: clamp(3.25rem, 12vw, 9rem);
  line-height: 0.82;
  letter-spacing: -0.06em;
  overflow-wrap: anywhere;
}

.pp-doc__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px var(--pp-t3);
  padding-top: var(--pp-t3);
  border-top: 1px solid var(--pp-line);
}

.pp-doc__eyebrow {
  flex-shrink: 0;
}

.pp-doc__meta-rule {
  flex: 1 1 60px;
  min-width: 40px;
  height: 1px;
  background: var(--pp-line);
}

.pp-doc__stamp {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--pp-ink-soft);
}

.pp-doc__nav {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: var(--pp-t2);
  border-top: 1px solid var(--pp-line);
  border-bottom: 1px solid var(--pp-line);
}

.pp-doc__nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 14px clamp(10px, 1.6vw, 20px);
  border-right: 1px solid var(--pp-line);
  font-family: var(--pp-mono);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pp-ink-soft);
  transition: color var(--pp-fast) var(--pp-ease), background-color var(--pp-fast) var(--pp-ease);
}

.pp-doc__nav-link:last-child {
  border-right: 0;
}

.pp-doc__nav-link:hover {
  color: var(--pp-ink);
  background: var(--pp-sheet-soft);
}

.pp-doc__nav-link:focus-visible {
  z-index: 1;
}

.pp-doc__nav-mark {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border: 1px solid currentColor;
  rotate: 45deg;
  opacity: 0.55;
}

.pp-doc__nav-link--current {
  color: var(--pp-accent-text);
  background: var(--pp-accent-soft);
}

.pp-doc__nav-link--current::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 2px;
  background: var(--pp-accent);
}

.pp-doc__nav-link--current .pp-doc__nav-mark {
  background: currentColor;
  opacity: 1;
}

.pp-doc__nav-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.pp-doc__body {
  padding-top: var(--pp-t4);
}

.pp-doc__clauses {
  background: var(--pp-sheet);
  border: 1px solid var(--pp-line);
  border-radius: 2px;
}

@media (max-width: 900px) {
  .pp-doc__head {
    padding-top: var(--pp-t5);
  }

  .pp-doc__stamp {
    margin-left: 0;
  }
}

@media (max-width: 560px) {
  .pp-doc {
    padding-bottom: var(--pp-t5);
  }

  .pp-doc__title {
    font-size: clamp(2.9rem, 16vw, 4.2rem);
  }

  .pp-doc__meta {
    align-items: flex-start;
    gap: 8px 12px;
  }

  .pp-doc__meta-rule {
    flex-basis: 100%;
    order: 3;
  }

  .pp-doc__stamp {
    flex-basis: 100%;
  }

  .pp-doc__nav-link {
    gap: 7px;
    padding: 12px 9px;
    font-size: 0.64rem;
    letter-spacing: 0.08em;
  }

  .pp-doc__nav-mark {
    width: 5px;
    height: 5px;
  }
}
</style>
