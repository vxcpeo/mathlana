<script setup>
/**
 * The orbit art behind "How close it is": a ring with its crossed ellipses and
 * an arrow leaving for the edge of the plate.
 */
</script>

<template>
  <svg viewBox="0 0 240 150" aria-hidden="true" class="pp-close-art">
    <g transform="rotate(-14 165 70)">
      <circle
        cx="165"
        cy="70"
        r="118"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        stroke-opacity="0.35"
      />
      <circle
        cx="165"
        cy="70"
        r="78"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
      />
      <ellipse
        cx="165"
        cy="70"
        rx="78"
        ry="25"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        stroke-dasharray="3 4"
      />
      <ellipse
        cx="165"
        cy="70"
        rx="25"
        ry="78"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        stroke-opacity="0.45"
      />
      <path
        d="M165 -18V158"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        stroke-opacity="0.45"
        stroke-dasharray="2 5"
      />
      <path
        d="M165 70L211 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
      />
      <circle cx="211" cy="16" r="5" fill="currentColor" />
      <circle cx="165" cy="70" r="2.5" fill="currentColor" />
    </g>
  </svg>
</template>

<style scoped>
.pp-close-art {
  width: auto;
  height: 100%;
  max-width: none;
}
</style>
