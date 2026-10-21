<script setup>
/**
 * Site footer.
 *
 * The theme control is the reference's own `segmented` component: the pressed
 * item is not tinted in place — an absolutely-positioned "thumb", filled with
 * `--foreground`, is clipped to the pressed item's bounds via `clip-path`, and
 * the thumb carries inverted "ink" copies of every item's icon so the selected
 * one reads light-on-dark. `--segmented-l` / `--segmented-r` carry the measure.
 *
 * Ported from the reference's compiled CSS, including the `data-slot` names.
 */
import { onMounted, onUnmounted, ref, watch, nextTick } from "vue";
import { RouterLink } from "vue-router";
import BrandMark from "@/components/brand/BrandMark.vue";
import Icon from "@/components/ui/Icon.vue";
import { useTheme } from "@/composables/useTheme";

const { mode, setMode } = useTheme();

const PRODUCT = [
  { label: "Tokens", to: "/tokens" },
  { label: "Launch a token", to: "/launch" },
  { label: "Challenges", to: "/challenges" },
  { label: "About", to: "/about" },
  { label: "Check a wallet", to: "/exposure" },
];

const LEGAL = [
  { label: "Terms", to: "/terms" },
  { label: "Privacy", to: "/privacy" },
  { label: "Risks", to: "/risks" },
];

const THEMES = [
  { key: "light", icon: "sun", label: "Light" },
  { key: "dark", icon: "moon", label: "Dark" },
  { key: "system", icon: "monitor", label: "System" },
];

const group = ref(null);
const itemRefs = ref([]);
const left = ref(0);
const right = ref(0);

/** Measure the pressed item against the group's padding box. */
function measure() {
  const container = group.value;
  const active = itemRefs.value[THEMES.findIndex((theme) => theme.key === mode.value)];
  if (!container || !active) return;
  const box = container.getBoundingClientRect();
  const border = parseFloat(getComputedStyle(container).borderLeftWidth) || 0;
  const origin = box.left + border;
  const item = active.getBoundingClientRect();
  left.value = Math.round((item.left - origin) * 100) / 100;
  right.value = Math.round((item.right - origin) * 100) / 100;
}

let observer = null;

onMounted(async () => {
  await nextTick();
  measure();
  // Fonts change the item widths once they load.
  document.fonts?.ready?.then(measure).catch(() => {});
  observer = new ResizeObserver(measure);
  if (group.value) observer.observe(group.value);
});

onUnmounted(() => observer?.disconnect());

watch(mode, async () => {
  await nextTick();
  measure();
});
</script>

<template>
  <footer class="mt-auto border-t">
    <div
      class="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.618fr_1fr]"
    >
      <div class="flex max-w-md flex-col gap-4">
        <RouterLink to="/" class="w-fit">
          <span
            class="inline-flex items-center gap-[0.5em] text-xl"
            role="img"
            aria-label="Qubitlane home"
          >
            <BrandMark />
            <span
              aria-hidden="true"
              translate="no"
              class="font-heading font-semibold tracking-[-0.01em] text-foreground"
              >Math<span style="color: #6c86ff">lana</span></span
            >
          </span>
        </RouterLink>
        <p class="text-sm text-muted-foreground">
          Math and cryptography research agents, on Solana.
        </p>
        <p class="text-xs leading-relaxed text-quiet">
          Research may find nothing, and a token promises no return. Qubitlane is not
          affiliated with the Ethereum Foundation, Yukon or any challenge's organizers.
        </p>
        <p class="text-xs leading-relaxed text-quiet">
          Paper search by arXiv, IACR ePrint and Semantic Scholar. Thank you to arXiv for
          use of its open access interoperability.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-8 text-sm">
        <div class="flex flex-col gap-3">
          <p
            class="font-heading text-xs font-semibold tracking-[0.08em] text-quiet uppercase"
          >
            Product
          </p>
          <ul class="flex flex-col gap-2">
            <li v-for="item in PRODUCT" :key="item.to">
              <RouterLink
                :to="item.to"
                class="text-muted-foreground transition-colors hover:text-foreground"
                >{{ item.label }}</RouterLink
              >
            </li>
          </ul>
        </div>

        <div class="flex flex-col gap-3">
          <p
            class="font-heading text-xs font-semibold tracking-[0.08em] text-quiet uppercase"
          >
            Legal
          </p>
          <ul class="flex flex-col gap-2">
            <li v-for="item in LEGAL" :key="item.to">
              <RouterLink
                :to="item.to"
                class="text-muted-foreground transition-colors hover:text-foreground"
                >{{ item.label }}</RouterLink
              >
            </li>
            <li class="pt-2">
              <div
                ref="group"
                role="group"
                data-slot="segmented"
                data-ready=""
                data-size="sm"
                aria-label="Theme"
                class="relative isolate inline-flex h-10 w-fit items-stretch rounded-[calc(var(--radius)+4px)] border p-[3px] text-sm data-[size=sm]:h-8 data-[size=sm]:text-[0.8rem]"
                :style="{
                  '--segmented-l': `${left}px`,
                  '--segmented-r': `${right}px`,
                  '--segmented-t': '3px',
                  '--segmented-b': '3px',
                  '--segmented-radius': 'var(--radius)',
                }"
              >
                <button
                  v-for="(theme, index) in THEMES"
                  :key="theme.key"
                  ref="itemRefs"
                  type="button"
                  data-slot="segmented-item"
                  :data-pressed="mode === theme.key ? '' : undefined"
                  :aria-pressed="mode === theme.key"
                  :aria-label="theme.label"
                  :tabindex="mode === theme.key ? 0 : -1"
                  class="relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-(--segmented-radius) px-2 font-medium whitespace-nowrap transition-[color,scale] duration-150 ease-out outline-none select-none active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-solid focus-visible:outline-ring disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  @click="setMode(theme.key)"
                >
                  <Icon :name="theme.icon" />
                </button>

                <!-- The inverted copy, clipped to the pressed item. -->
                <span aria-hidden="true" data-slot="segmented-thumb">
                  <span
                    v-for="theme in THEMES"
                    :key="theme.key"
                    class="inline-flex shrink-0 items-center justify-center gap-1.5 px-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  >
                    <Icon :name="theme.icon" />
                  </span>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
