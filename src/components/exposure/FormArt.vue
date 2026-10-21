<script setup>
/**
 * The engraved art behind the "Check a wallet" form header: a sphere of rings
 * with a field of faint squares drifting away from it. Radii, spacing and
 * opacities are the reference's own values.
 */
const RINGS = Array.from({ length: 13 }, (_, i) => ({
  r: 10 + i * 9,
  opacity: Number((1 - i * 0.065).toFixed(3)),
}));

/** Row-major opacities of the 7×7 square field, lifted from the reference. */
const FIELD = [
  0.156, 0.287, 0.3, 0.398, 0.324, 0.275, 0.16,
  0.272, 0.409, 0.475, 0.584, 0.433, 0.438, 0.23,
  0.374, 0.377, 0.718, 0.589, 0.7, 0.468, 0.353,
  0.358, 0.55, 0.734, 0.823, 0.775, 0.462, 0.405,
  0.296, 0.557, 0.472, 0.798, 0.538, 0.542, 0.327,
  0.28, 0.387, 0.507, 0.559, 0.47, 0.429, 0.243,
  0.161, 0.238, 0.375, 0.297, 0.373, 0.244, 0.161,
];

const SQUARES = FIELD.map((opacity, index) => ({
  x: 32 + (index % 7) * 11,
  y: 18 + Math.floor(index / 7) * 11,
  opacity,
}));
</script>

<template>
  <svg viewBox="0 0 240 150" aria-hidden="true" class="pp-form-art">
    <g transform="rotate(-16 170 58)">
      <circle
        v-for="ring in RINGS"
        :key="ring.r"
        cx="170"
        cy="58"
        :r="ring.r"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        vector-effect="non-scaling-stroke"
        :stroke-opacity="ring.opacity"
      />
      <circle cx="170" cy="58" r="4.5" fill="currentColor" />
      <rect
        v-for="square in SQUARES"
        :key="`${square.x}-${square.y}`"
        :x="square.x"
        :y="square.y"
        width="4"
        height="4"
        rx="0.6"
        fill="currentColor"
        :fill-opacity="square.opacity"
      />
    </g>
  </svg>
</template>

<style scoped>
.pp-form-art {
  width: auto;
  height: 100%;
  max-width: none;
}
</style>
