<script setup>
/**
 * 404 — the reference's own "Nothing here" page, rebuilt as a single
 * documentation plate: a ruled colophon line, the running head, one line of
 * copy and the ways back.
 */
import { RouterLink } from "vue-router";
import BrandMark from "@/components/brand/BrandMark.vue";
import CardArt from "@/components/art/CardArt.vue";
import AppButton from "@/components/ui/AppButton.vue";
</script>

<template>
  <!-- The layout already provides <main id="main">, so the page root is a div. -->
  <div class="cq-page cq-notfound">
    <header class="cq-pagehead cq-notfound__head">
      <div class="cq-pagehead__head">
        <h1 class="cq-runhead cq-notfound__title">Nothing here</h1>
      </div>

      <div class="cq-pagehead__edge cq-notfound__headedge">
        <span class="cq-notfound__folio" aria-hidden="true" />
      </div>
    </header>

    <div class="cq-notfound__stage">
      <section class="cq-sheet cq-notfound__plate">
        <div class="cq-notfound__bar">
          <RouterLink to="/" class="cq-notfound__brand">
            <span
              class="cq-notfound__lock"
              role="img"
              aria-label="Qubitess home"
            >
              <BrandMark />
              <span
                aria-hidden="true"
                translate="no"
                class="cq-notfound__wordmark"
                >Qubit<span>ess</span></span
              >
            </span>
          </RouterLink>
          <span class="cq-notfound__bar-rule" aria-hidden="true" />
          <span class="cq-notfound__bar-mark" aria-hidden="true" />
        </div>

        <div class="cq-notfound__main">
          <div class="cq-notfound__copy">
            <p class="cq-lede cq-notfound__lede">
              This page doesn't exist, or it moved.
            </p>
            <div class="cq-inline cq-notfound__actions">
              <AppButton to="/" size="lg">Go home</AppButton>
              <AppButton to="/challenges" variant="outline" size="lg"
                >See the challenges</AppButton
              >
            </div>
          </div>

          <div class="cq-notfound__art" aria-hidden="true">
            <CardArt name="figure" />
          </div>
        </div>

        <div class="cq-notfound__foot" aria-hidden="true">
          <span class="cq-notfound__foot-mark" />
          <span class="cq-notfound__foot-rule" />
          <span class="cq-notfound__foot-mark" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.cq-notfound {
  padding-bottom: clamp(28px, 4vw, 56px);
}

/* running head -------------------------------------------------------- */
.cq-notfound__head {
  align-items: end;
}

.cq-notfound__title {
  font-size: clamp(56px, 12vw, 152px);
  line-height: 0.82;
  letter-spacing: -0.06em;
}

.cq-notfound__headedge {
  align-items: flex-end;
  padding-bottom: 10px;
}

.cq-notfound__folio {
  position: relative;
  display: block;
  width: 42px;
  height: 42px;
  border-top: 1px solid var(--cq-accent);
  border-left: 1px solid var(--cq-accent);
}

.cq-notfound__folio::before,
.cq-notfound__folio::after {
  content: "";
  position: absolute;
  background: var(--cq-accent-line);
}

.cq-notfound__folio::before {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
}

.cq-notfound__folio::after {
  top: 0;
  left: 50%;
  width: 1px;
  height: 100%;
}

/* centred plate ------------------------------------------------------- */
.cq-notfound__stage {
  display: grid;
  place-items: start center;
  padding-top: clamp(2px, 0.8vw, 10px);
}

.cq-notfound__plate {
  width: 100%;
  max-width: 720px;
  overflow: clip;
}

.cq-notfound__bar {
  display: flex;
  align-items: center;
  gap: var(--cq-t3);
  padding: 14px clamp(18px, 3vw, 28px);
  border-bottom: 1px solid var(--cq-line);
  background: var(--cq-sheet-soft);
}

.cq-notfound__brand {
  display: inline-flex;
  align-items: center;
  color: var(--cq-ink);
}

.cq-notfound__lock {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.cq-notfound__lock :deep(svg) {
  width: 22px;
  height: auto;
  color: var(--cq-accent);
}

.cq-notfound__wordmark {
  font-family: var(--cq-display);
  font-weight: var(--cq-display-weight);
  letter-spacing: var(--cq-display-tracking);
  font-size: 18px;
  line-height: 1;
  color: var(--cq-ink);
}

.cq-notfound__wordmark > span {
  color: var(--cq-accent-text);
}

.cq-notfound__bar-rule {
  flex: 1;
  height: 1px;
  background: var(--cq-line);
}

.cq-notfound__bar-mark {
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border: 1px solid var(--cq-accent);
  rotate: 45deg;
}

.cq-notfound__main {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(200px, 0.75fr);
  gap: clamp(24px, 4vw, 52px);
  align-items: center;
  min-height: clamp(240px, 40vh, 360px);
  padding: clamp(26px, 4.4vw, 48px);
}

.cq-notfound__copy {
  display: grid;
  align-content: center;
  justify-items: start;
  gap: clamp(16px, 2vw, 22px);
  min-width: 0;
}

.cq-notfound__lede {
  max-width: 34ch;
  color: var(--cq-ink-soft);
}

.cq-notfound__actions {
  gap: 10px;
}

.cq-notfound__art {
  display: block;
  min-width: 0;
  color: var(--cq-accent);
  opacity: 0.28;
}

.cq-notfound__art :deep(svg) {
  width: 100%;
  height: auto;
  max-height: 300px;
}

.cq-notfound__foot {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px clamp(18px, 3vw, 28px);
  border-top: 1px solid var(--cq-line);
  background: var(--cq-sheet-soft);
}

.cq-notfound__foot-mark {
  width: 5px;
  height: 5px;
  flex-shrink: 0;
  background: var(--cq-accent);
}

.cq-notfound__foot-rule {
  flex: 1;
  height: 1px;
  background: var(--cq-line);
}

@media (max-width: 960px) {
  .cq-notfound__headedge {
    align-items: flex-start;
  }
}

@media (max-width: 720px) {
  .cq-notfound__main {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
  }

  .cq-notfound__art {
    display: none;
  }
}

@media (max-width: 560px) {
  .cq-notfound__title {
    font-size: clamp(44px, 15vw, 72px);
  }

  .cq-notfound__bar {
    padding: 12px 14px;
    gap: 12px;
  }

  .cq-notfound__main {
    padding: 26px 16px 30px;
    gap: 20px;
  }

  .cq-notfound__actions {
    align-items: stretch;
    width: 100%;
  }

  .cq-notfound__actions :deep(.cq-btn) {
    flex: 1 1 12rem;
  }

  .cq-notfound__foot {
    padding: 12px 14px;
  }
}
</style>
