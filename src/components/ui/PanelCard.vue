<script setup>
/**
 * Blueprint sheet: a bordered paper surface with a ruled header band that can
 * carry an engraved line-art flourish and header actions.
 */
import { computed } from "vue";
import Icon from "@/components/ui/Icon.vue";
import CardArt from "@/components/art/CardArt.vue";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  icon: { type: String, default: null },
  title: { type: String, default: null },
  subtitle: { type: String, default: null },
  /** Line art shown in the header corner. */
  art: { type: String, default: null },
  tone: { type: String, default: "brand" },
  /** Header padding: "sm" for compact sheets, "lg" for full banners. */
  headerSize: { type: String, default: "sm" },
  /** Hide the art below the `sm` breakpoint. */
  artResponsive: { type: Boolean, default: false },
  class: { type: String, default: "" },
});

const TONES = {
  brand: "pp-tone-accent",
  quantum: "pp-tone-accent",
  proven: "pp-tone-live",
  caution: "pp-tone-warn",
  note: "pp-tone-note",
  muted: "pp-tone-muted",
  foreground: "pp-tone-ink",
};

const toneClass = computed(() => TONES[props.tone] ?? TONES.brand);
</script>

<template>
  <div class="pp-sheet" :class="class">
    <div
      v-if="title || subtitle || $slots.header"
      class="pp-sheet__head"
      :class="headerSize === 'lg' ? 'pp-sheet__head--lg' : ''"
    >
      <slot name="art">
        <span
          v-if="art"
          aria-hidden="true"
          class="pp-art pp-sheet__art"
          :class="artResponsive ? 'pp-art--responsive' : ''"
        >
          <CardArt :name="art" />
        </span>
      </slot>

      <slot name="header">
        <div class="pp-sheet__head-row">
          <Icon v-if="icon" :name="icon" :size="16" :class="toneClass" />
          <h3 class="pp-sheet__title">{{ title }}</h3>
        </div>
        <p v-if="subtitle" class="pp-sheet__sub">{{ subtitle }}</p>
      </slot>

      <slot name="header-actions" />
    </div>

    <slot />
  </div>
</template>
