<script setup>
/** Challenge detail running head: host, verb, name, the brief, and the launch CTA. */
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
  <header class="cq-pagehead cq-chero">
    <div class="cq-pagehead__head cq-chero__head">
      <p class="cq-kicker cq-chero__kicker">
        <ChallengeIcon :name="hostIcon" class="cq-chero__hosticon" />{{ hostLabel }}
      </p>

      <h1 class="cq-runhead cq-chero__name">{{ name }}</h1>

      <div class="cq-chero__meta">
        <VerbBadge :verb="verb" :icon="verbIcon" :icon-class="verbIconClass" />
        <RouterLink :to="`/launch?track=${track}`" class="cq-btn cq-btn--lg"
          >Launch a token on it</RouterLink
        >
      </div>

      <p class="cq-tiny cq-chero__note">{{ ctaNote }}</p>

      <span class="cq-chero__art" aria-hidden="true">
        <img src="/brand/urania-ink.png" alt="" class="cq-chero__ink" />
        <img src="/brand/urania-indigo.png" alt="" class="cq-chero__indigo" />
      </span>
    </div>

    <div class="cq-pagehead__edge cq-chero__edge">
      <div class="cq-chero__summary">
        <h2 class="cq-h4">What it asks</h2>
        <p class="cq-lede cq-chero__asks">{{ asks }}</p>
      </div>

      <div v-if="why" class="cq-chero__summary">
        <h2 class="cq-h4">Why it matters</h2>
        <p class="cq-small cq-chero__why">{{ why }}</p>
      </div>
    </div>
  </header>
</template>

<style scoped>
.cq-chero {
  position: relative;
  align-items: start;
  padding-top: clamp(6px, 1.4vw, 22px);
}

.cq-chero__head {
  position: relative;
  display: grid;
  align-content: start;
  gap: var(--cq-t3);
  min-width: 0;
  padding-bottom: var(--cq-t2);
}

.cq-chero__kicker {
  gap: 8px;
  color: var(--cq-muted);
}

.cq-chero__hosticon {
  width: 15px;
  height: 15px;
  color: var(--cq-accent-text);
}

.cq-chero__name {
  position: relative;
  z-index: 1;
  max-width: 14ch;
  overflow-wrap: anywhere;
}

.cq-chero__meta {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
}

.cq-chero__note {
  position: relative;
  z-index: 1;
  max-width: 54ch;
  color: var(--cq-muted);
}

.cq-chero__edge {
  display: grid;
  gap: var(--cq-t3);
  align-content: start;
  padding-bottom: 0;
}

.cq-chero__summary {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.cq-chero__asks {
  font-size: clamp(1rem, 1.15vw, 1.12rem);
  line-height: 1.55;
}

.cq-chero__why {
  color: var(--cq-muted);
}

.cq-chero__art {
  position: absolute;
  right: clamp(-18px, -1vw, 0px);
  bottom: -14px;
  z-index: 0;
  width: clamp(120px, 16vw, 210px);
  height: clamp(130px, 17vw, 220px);
  opacity: 0.16;
  pointer-events: none;
}

.cq-chero__art img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom right;
  -webkit-mask-image: linear-gradient(to bottom, #000 45%, transparent 94%);
  mask-image: linear-gradient(to bottom, #000 45%, transparent 94%);
}

.cq-chero__indigo {
  display: none;
}

:global(.dark) .cq-chero__ink {
  display: none;
}

:global(.dark) .cq-chero__indigo {
  display: block;
}

@media (max-width: 960px) {
  .cq-chero__name {
    max-width: 18ch;
  }

  .cq-chero__art {
    display: none;
  }
}
</style>
