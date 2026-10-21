<script setup>
/**
 * The reference's panel: a bordered `bg-card` surface with a header band that
 * carries an engraved line-art flourish in the top-right corner.
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
  /** Header padding: "sm" for panel rows, "lg" for full banners. */
  headerSize: { type: String, default: "sm" },
  /** Hide the art below the `sm` breakpoint (reference does this on banners). */
  artResponsive: { type: Boolean, default: false },
  class: { type: String, default: "" },
});

const TONES = {
  brand: "text-brand-text",
  quantum: "text-quantum-text",
  proven: "text-proven-text",
  caution: "text-caution-text",
  note: "text-note-text",
  muted: "text-muted-foreground",
  foreground: "text-foreground",
};

const toneClass = computed(() => TONES[props.tone] ?? TONES.brand);
</script>

<template>
  <div class="group flex flex-col overflow-hidden rounded-xl border bg-card" :class="class">
    <div
      v-if="title || subtitle || $slots.header"
      class="relative overflow-hidden border-b"
      :class="headerSize === 'lg' ? 'px-5 py-5 sm:px-6' : 'px-5 py-4'"
    >
      <slot name="art">
        <span
          v-if="art"
          aria-hidden="true"
          class="pointer-events-none absolute -top-8 -right-8 bottom-1 flex items-center text-brand opacity-45 transition-[opacity,transform] duration-500 ease-out group-hover:-rotate-2 group-hover:opacity-80 motion-reduce:transition-none"
          :class="artResponsive ? 'max-sm:hidden' : ''"
        >
          <CardArt :name="art" class="h-full" />
        </span>
      </slot>

      <slot name="header">
        <h3
          class="relative flex items-center gap-2 font-heading font-semibold tracking-[-0.01em]"
          :class="headerSize === 'lg' ? 'text-2xl text-balance sm:text-3xl' : 'text-base'"
        >
          <Icon v-if="icon" :name="icon" class="size-4 shrink-0" :class="toneClass" />
          {{ title }}
        </h3>
        <p
          v-if="subtitle"
          class="relative text-pretty text-muted-foreground"
          :class="
            headerSize === 'lg'
              ? 'mt-1.5 text-sm sm:max-w-[60%]'
              : 'mt-0.5 max-w-[60%] text-[0.8rem] sm:max-w-[65%] sm:truncate'
          "
        >
          {{ subtitle }}
        </p>
      </slot>

      <slot name="header-actions" />
    </div>

    <slot />
  </div>
</template>
