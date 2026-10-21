<script setup>
/** Challenge detail masthead: host, verb, name, the brief, and the launch CTA. */
import { RouterLink } from "vue-router";
import ChallengeIcon from "@/components/challenges/ChallengeIcon.vue";
import VerbBadge from "@/components/challenges/VerbBadge.vue";

defineProps({
  hostIcon: { type: String, required: true },
  hostLabel: { type: String, required: true },
  verb: { type: String, required: true },
  verbIcon: { type: String, required: true },
  verbIconClass: { type: String, default: "text-brand" },
  name: { type: String, required: true },
  asks: { type: String, required: true },
  why: { type: String, default: null },
  /** `?track=` value the launch page reads. */
  track: { type: String, required: true },
  ctaNote: { type: String, required: true },
});
</script>

<template>
  <section class="pp-head pp-hero">
    <div class="pp-head__row pp-hero__row">
      <div class="pp-stack pp-hero__main">
        <div class="pp-inline pp-hero__meta">
          <p class="pp-eyebrow pp-inline pp-hero__host">
            <ChallengeIcon :name="hostIcon" class="pp-hero__hosticon" />{{ hostLabel }}
          </p>
          <VerbBadge :verb="verb" :icon="verbIcon" :icon-class="verbIconClass" />
        </div>

        <h1 class="pp-runhead">{{ name }}</h1>

        <div class="pp-grid pp-grid--2 pp-hero__facts">
          <div class="pp-stack--tight">
            <h2 class="pp-h4">What it asks</h2>
            <p class="pp-body">{{ asks }}</p>
          </div>
          <div v-if="why" class="pp-stack--tight">
            <h2 class="pp-h4">Why it matters</h2>
            <p class="pp-body">{{ why }}</p>
          </div>
        </div>

        <div class="pp-inline pp-hero__cta">
          <RouterLink :to="`/launch?track=${track}`" class="pp-btn pp-btn--lg"
            >Launch a token on it</RouterLink
          >
          <p class="pp-tiny pp-hero__note">{{ ctaNote }}</p>
        </div>
      </div>

      <div class="pp-hero__art" aria-hidden="true">
        <img src="/brand/urania-ink.png" alt="" class="pp-hero__ink" />
        <img src="/brand/urania-indigo.png" alt="" class="pp-hero__indigo" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.pp-hero {
  gap: var(--pp-t4);
}

.pp-hero__row {
  align-items: start;
  gap: clamp(24px, 4vw, 56px);
}

.pp-hero__main {
  flex: 1 1 38rem;
  min-width: 0;
  gap: var(--pp-t4);
}

.pp-hero__meta {
  gap: 10px 14px;
}

.pp-hero__host {
  gap: 8px;
}

.pp-hero__hosticon {
  width: 16px;
  height: 16px;
  color: var(--pp-accent-text);
}

.pp-hero__art {
  display: none;
}

.pp-hero__art img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom;
  -webkit-mask-image: linear-gradient(to bottom, #000 58%, transparent 96%);
  mask-image: linear-gradient(to bottom, #000 58%, transparent 96%);
}

.pp-hero__indigo {
  display: none;
}

.pp-hero__facts {
  gap: var(--pp-t3) var(--pp-t4);
}

.pp-hero__cta {
  gap: 14px;
  align-items: center;
}

.pp-hero__note {
  max-width: 46ch;
}

:global(.dark) .pp-hero__ink {
  display: none;
}

:global(.dark) .pp-hero__indigo {
  display: block;
}

@media (min-width: 900px) {
  .pp-hero__row {
    flex-wrap: nowrap;
  }

  .pp-hero__art {
    display: block;
    flex: 0 0 clamp(13rem, 20vw, 18rem);
    height: clamp(14rem, 22vw, 20rem);
    min-width: 0;
  }
}
</style>
