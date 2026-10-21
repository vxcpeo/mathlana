<script setup>
/** Button primitive for the command-rail shell. */
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
  default: "",
  outline: "cq-btn--line",
  secondary: "cq-btn--line",
  ghost: "cq-btn--quiet",
  destructive: "cq-btn--alert",
  link: "cq-btn--quiet cq-btn--linkish",
};

const sizes = {
  sm: "cq-btn--sm",
  default: "",
  lg: "cq-btn--lg",
  icon: "cq-btn--icon",
};

const classes = computed(() => [
  "cq-btn",
  variants[props.variant] ?? "",
  sizes[props.size] ?? "",
  props.rounded ? "cq-btn--square" : "",
  props.class,
]);
</script>

<template>
  <!--
    One branch per target. Binding `href` on a RouterLink would fall through onto
    the anchor RouterLink renders and clobber the href it computes, so each tag
    only ever receives its own link attribute.
  -->
  <RouterLink v-if="to" :to="to || undefined" :class="classes">
    <slot />
  </RouterLink>
  <a v-else-if="href" :href="href || undefined" :class="classes">
    <slot />
  </a>
  <button
    v-else
    :type="to || href ? undefined : type"
    :disabled="disabled || undefined"
    :class="classes"
  >
    <slot />
  </button>
</template>
