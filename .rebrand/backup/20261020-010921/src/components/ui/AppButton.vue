<script setup>
/** Button — mirrors the reference's `data-slot="button"` variants. */
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  variant: { type: String, default: "default" }, // default | outline | ghost | secondary | link
  size: { type: String, default: "default" }, // sm | default | lg | icon
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  type: { type: String, default: "button" },
  disabled: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  class: { type: String, default: "" },
});

const variants = {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  outline:
    "border-border bg-background hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "border-transparent hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
  destructive:
    "border-transparent bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
  link: "border-transparent text-primary underline-offset-4 hover:underline",
};

const sizes = {
  sm: "h-8 gap-1.5 px-2.5 text-[0.8rem]",
  default: "h-9 gap-1.5 px-2.5",
  lg: "h-10 gap-1.5 px-3.5",
  icon: "size-9",
};

const classes = computed(() => [
  "group/button inline-flex shrink-0 items-center justify-center border bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "active:not-aria-[haspopup]:translate-y-px",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  props.rounded ? "rounded-full" : "rounded-lg",
  variants[props.variant] ?? variants.default,
  sizes[props.size] ?? sizes.default,
  props.class,
]);

const tag = computed(() => (props.to ? RouterLink : props.href ? "a" : "button"));
</script>

<template>
  <component
    :is="tag"
    :to="to || undefined"
    :href="href || undefined"
    :type="to || href ? undefined : type"
    :disabled="to || href ? undefined : disabled"
    data-slot="button"
    :class="classes"
  >
    <slot />
  </component>
</template>
