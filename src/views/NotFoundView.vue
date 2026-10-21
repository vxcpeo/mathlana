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
  <div class="pp-page pp-notfound">
    <section class="pp-notfound__plate">
      <div class="pp-notfound__bar">
        <RouterLink to="/" class="pp-command__brand">
          <span
            class="pp-inline"
            role="img"
            aria-label="Qubitlane home"
          >
            <BrandMark />
            <span
              aria-hidden="true"
              translate="no"
              class="pp-command__wordmark"
              >Qubit<span>lane</span></span
            >
          </span>
        </RouterLink>
        <span class="pp-notfound__bar-rule" aria-hidden="true" />
        <span class="pp-notfound__bar-mark" aria-hidden="true" />
      </div>

      <div class="pp-notfound__main">
        <div class="pp-notfound__copy">
          <span class="pp-notfound__folio" aria-hidden="true" />
          <h1 class="pp-runhead pp-notfound__title">Nothing here</h1>
          <p class="pp-lede pp-notfound__lede">
            This page doesn't exist, or it moved.
          </p>
          <div class="pp-inline pp-notfound__actions">
            <AppButton to="/" size="lg">Go home</AppButton>
            <AppButton to="/challenges" variant="outline" size="lg"
              >See the challenges</AppButton
            >
          </div>
        </div>

        <div class="pp-notfound__art" aria-hidden="true">
          <CardArt name="figure" />
        </div>
      </div>

      <div class="pp-notfound__foot" aria-hidden="true">
        <span class="pp-notfound__foot-mark" />
        <span class="pp-notfound__foot-rule" />
        <span class="pp-notfound__foot-mark" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.pp-notfound {
  padding-top: var(--pp-t6);
  padding-bottom: var(--pp-t6);
}

.pp-notfound__plate {
  width: 100%;
  max-width: 72rem;
  background: var(--pp-sheet);
  border: 1px solid var(--pp-line);
  border-radius: 2px;
}

.pp-notfound__bar {
  display: flex;
  align-items: center;
  gap: var(--pp-t3);
  padding: 16px clamp(18px, 3vw, 30px);
  border-bottom: 1px solid var(--pp-line);
}

.pp-notfound__bar-rule {
  flex: 1;
  height: 1px;
  background: var(--pp-line);
}

.pp-notfound__bar-mark {
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border: 1px solid var(--pp-accent);
  rotate: 45deg;
}

.pp-notfound__main {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(220px, 0.55fr);
  gap: clamp(24px, 4vw, 64px);
  align-items: center;
  min-height: clamp(340px, 52vh, 540px);
  padding: clamp(28px, 5vw, 60px);
}

.pp-notfound__copy {
  display: grid;
  align-content: center;
  justify-items: start;
  gap: clamp(16px, 2vw, 24px);
  min-width: 0;
}

.pp-notfound__folio {
  position: relative;
  display: block;
  width: 42px;
  height: 42px;
  border-top: 1px solid var(--pp-accent);
  border-left: 1px solid var(--pp-accent);
}

.pp-notfound__folio::before,
.pp-notfound__folio::after {
  content: "";
  position: absolute;
  background: var(--pp-accent-line);
}

.pp-notfound__folio::before {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
}

.pp-notfound__folio::after {
  top: 0;
  left: 50%;
  width: 1px;
  height: 100%;
}

.pp-notfound__title {
  font-size: clamp(3.4rem, 9vw, 7.4rem);
  line-height: 0.86;
  letter-spacing: -0.055em;
}

.pp-notfound__lede {
  max-width: 34ch;
  color: var(--pp-ink-soft);
}

.pp-notfound__actions {
  gap: 10px;
  padding-top: var(--pp-t2);
}

.pp-notfound__art {
  display: block;
  min-width: 0;
  color: var(--pp-accent);
  opacity: 0.28;
}

.pp-notfound__art :deep(svg) {
  width: 100%;
  height: auto;
  max-height: 340px;
}

.pp-notfound__foot {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px clamp(18px, 3vw, 30px);
  border-top: 1px solid var(--pp-line);
}

.pp-notfound__foot-mark {
  width: 5px;
  height: 5px;
  flex-shrink: 0;
  background: var(--pp-accent);
}

.pp-notfound__foot-rule {
  flex: 1;
  height: 1px;
  background: var(--pp-line);
}

@media (max-width: 900px) {
  .pp-notfound {
    padding-top: var(--pp-t5);
    padding-bottom: var(--pp-t5);
  }

  .pp-notfound__main {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
  }

  .pp-notfound__art {
    display: none;
  }
}

@media (max-width: 560px) {
  .pp-notfound__bar {
    padding: 12px 14px;
    gap: 12px;
  }

  .pp-notfound__main {
    padding: 26px 16px 30px;
    gap: 20px;
  }

  .pp-notfound__title {
    font-size: clamp(3rem, 15vw, 4.2rem);
  }

  .pp-notfound__actions {
    align-items: stretch;
    width: 100%;
  }

  .pp-notfound__actions :deep(.pp-btn) {
    flex: 1 1 12rem;
  }

  .pp-notfound__foot {
    padding: 12px 14px;
  }
}
</style>
