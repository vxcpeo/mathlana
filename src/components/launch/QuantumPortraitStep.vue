<script setup>
/**
 * Step 01 — "Its picture". The drop zone plus the "Make it quantum" card and
 * the portrait panel it expands into.
 *
 * The panel's queue is simulated: the reference parks the portrait in a real
 * quantum machine's queue for a few minutes, so here the run walks through the
 * same phases on a short timer and then shows the drawn placeholder, seeded
 * from the picked file.
 */
import { computed, onBeforeUnmount, ref, watch } from "vue";
import CardArt from "@/components/art/CardArt.vue";
import AppButton from "@/components/ui/AppButton.vue";
import Icon from "@/components/ui/Icon.vue";
import LaunchGlyph from "@/components/launch/LaunchGlyph.vue";
import LaunchStep from "@/components/launch/LaunchStep.vue";
import { QUANTUM_MACHINES } from "@/data/challenges";

const picture = defineModel("picture", { type: Object, default: null });
const error = defineModel("error", { type: String, default: null });

const ACCEPT = "image/png,image/jpeg,image/gif,image/webp";
const ACCEPTED_TYPES = ACCEPT.split(",");
const MAX_BYTES = 2 * 1024 * 1024;

const open = ref(false);
const stage = ref("idle"); // idle | queued | done
const phase = ref(0);
const result = ref(null);

let timers = [];

const PHASES = ["Preparing the qubits", "Measuring, point by point", "Entangling the grain"];

const online = QUANTUM_MACHINES.filter((machine) => machine.online);

/** Stable per-file seed, so the same picture always draws the same result. */
function seedOf(file) {
  const key = `${file.name}:${file.size}:${file.lastModified}`;
  let hash = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

const score = computed(() => result.value?.score ?? null);

const statusText = computed(() => {
  if (stage.value === "queued") return PHASES[phase.value] ?? PHASES[0];
  if (stage.value === "done" && score.value) return `Entangled ${score.value}`;
  return null;
});

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function pick(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  if (file.size > MAX_BYTES) {
    error.value = "The picture is over 2 MB.";
    return;
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    error.value = "Use a PNG, JPEG, GIF or WebP picture.";
    return;
  }

  error.value = null;
  if (picture.value?.url) URL.revokeObjectURL(picture.value.url);
  picture.value = { file, name: file.name, url: URL.createObjectURL(file) };
  clearTimers();
  stage.value = "idle";
  result.value = null;
}

function draw() {
  if (!picture.value || stage.value === "queued") return;
  clearTimers();
  phase.value = 0;
  stage.value = "queued";

  PHASES.slice(1).forEach((_, index) => {
    timers.push(setTimeout(() => (phase.value = index + 1), 2200 * (index + 1)));
  });
  timers.push(
    setTimeout(() => {
      const seed = seedOf(picture.value.file);
      result.value = {
        score: (0.8 + (seed % 2000) / 10000).toFixed(4),
        machine: online[seed % online.length],
      };
      stage.value = "done";
    }, 6800),
  );
}

watch(open, (isOpen) => {
  if (!isOpen) clearTimers();
});

onBeforeUnmount(() => {
  clearTimers();
  if (picture.value?.url) URL.revokeObjectURL(picture.value.url);
});
</script>

<template>
  <LaunchStep index="01" title="Its picture" hint="PNG, JPEG, GIF or WebP, up to 2 MB. Square looks best.">
    <div class="cq-lpic">
      <div class="cq-lpic__intake">
        <label
          for="launch-image"
          class="cq-lpic__drop"
          :class="picture ? 'cq-lpic__drop--filled' : ''"
        >
          <img v-if="picture" :src="picture.url" alt="" class="cq-lpic__thumb" />
          <span v-if="picture" class="cq-lpic__change">Change</span>
          <span v-else class="cq-lpic__empty">
            <Icon name="image-up" :size="20" class="cq-lpic__emptyicon" />Choose a picture
          </span>
        </label>
        <input id="launch-image" type="file" :accept="ACCEPT" class="sr-only" @change="pick" />

        <div class="cq-lpic__quantum" :class="open ? 'cq-lpic__quantum--open' : ''">
          <div class="cq-lpic__quantum-head">
            <LaunchGlyph name="quantum" width="20" height="20" class="cq-lpic__glyph" />
            <div class="cq-lpic__quantum-copy">
              <p class="cq-lpic__quantum-title">Make it quantum</p>
              <p class="cq-small">Art made of real quantum measurements, a grain an ordinary computer can only imitate. Platform covers the cost.</p>
            </div>
            <AppButton
              size="sm"
              :aria-expanded="open"
              aria-controls="launch-quantum"
              @click="open = !open"
            >
              {{ open ? "Hide" : "Draw it" }}
              <Icon
                name="chevron-down"
                :stroke-width="1.75"
                :size="15"
                class="cq-lpic__chev"
                :class="open ? 'cq-lpic__chev--up' : ''"
              />
            </AppButton>
          </div>

          <dl class="cq-lpic__facts">
            <div class="cq-lpic__fact">
              <dt class="cq-lpic__term">
                <Icon name="scan-line" :stroke-width="1.75" :size="14" class="cq-lpic__factic" />Real measurements
              </dt>
              <dd class="cq-lpic__def">Real qubits, not AI.</dd>
            </div>
            <div class="cq-lpic__fact">
              <dt class="cq-lpic__term">
                <Icon
                  name="fingerprint-pattern"
                  :stroke-width="1.75"
                  :size="14"
                  class="cq-lpic__factic"
                />One of a kind
              </dt>
              <dd class="cq-lpic__def">Every run comes out new.</dd>
            </div>
            <div class="cq-lpic__fact">
              <dt class="cq-lpic__term">
                <Icon name="atom" :stroke-width="1.75" :size="14" class="cq-lpic__factic" />Entanglement check
              </dt>
              <dd class="cq-lpic__def">Its score comes with it.</dd>
            </div>
          </dl>
        </div>
      </div>

      <div v-if="open" class="cq-lpic__screen" id="launch-quantum">
        <span aria-hidden="true" class="cq-lpic__tick cq-lpic__tick--tl"></span>
        <span aria-hidden="true" class="cq-lpic__tick cq-lpic__tick--tr"></span>
        <span aria-hidden="true" class="cq-lpic__tick cq-lpic__tick--bl"></span>
        <span aria-hidden="true" class="cq-lpic__tick cq-lpic__tick--br"></span>

        <div class="cq-lpic__screenbar">
          <span class="cq-lpic__screenlabel">
            <LaunchGlyph name="quantum" width="14" height="14" />Quantum portrait
          </span>
        </div>

        <div class="cq-lpic__screengrid">
          <figure class="cq-lpic__fig">
            <img v-if="picture" :src="picture.url" alt="" class="cq-lpic__shot" />
            <label v-else for="launch-image" class="cq-lpic__screenempty">
              <Icon name="image-up" :size="24" class="cq-lpic__screenemptyicon" />Choose a picture
            </label>
            <figcaption class="cq-lpic__cap">Your picture</figcaption>
          </figure>

          <figure class="cq-lpic__fig">
            <div class="cq-lpic__plate">
              <div v-if="stage === 'idle'" class="cq-lpic__state">
                <LaunchGlyph name="quantum" :stroke-width="1.25" width="32" height="32" class="cq-lpic__big" />
                <AppButton size="sm" :disabled="!picture" @click="draw">
                  <LaunchGlyph name="quantum" width="16" height="16" />Draw it
                </AppButton>
                <span v-if="!picture" class="cq-lpic__gate">Choose a picture first</span>
              </div>

              <div v-else-if="stage === 'queued'" class="cq-lpic__state">
                <LaunchGlyph
                  name="quantum"
                  :stroke-width="1.25"
                  width="40"
                  height="40"
                  class="cq-lpic__big cq-live-pulse"
                />
              </div>

              <div v-else class="cq-lpic__state">
                <CardArt name="seal" class="cq-lpic__seal" />
              </div>

              <div v-if="stage === 'done'" class="cq-lpic__state cq-lpic__state--over">
                <AppButton size="sm" @click="draw">
                  <LaunchGlyph name="quantum" width="16" height="16" />Draw it again
                </AppButton>
              </div>

              <p v-if="statusText" aria-live="polite" class="cq-lpic__status">
                <span class="cq-lpic__statustxt">{{ statusText }}</span>
              </p>
            </div>
            <figcaption class="cq-lpic__cap cq-lpic__cap--accent">Quantum version</figcaption>
          </figure>
        </div>

        <div class="cq-lpic__notes">
          <p v-if="stage === 'idle'" class="cq-small">
            Your picture on the left, its quantum version on the right. Press Draw it and a real
            quantum computer measures it point by point; the look comes out different every time.
          </p>
          <p v-else-if="stage === 'done'" class="cq-small">
            Drawn on {{ result.machine.model }}, {{ result.machine.qubits }} qubits. The
            entanglement score, {{ result.score }}, goes on chain with the token.
          </p>
          <div class="cq-lpic__caution">
            <p class="cq-lpic__note">
              <Icon name="clock" :stroke-width="1.75" :size="14" class="cq-lpic__noteicon" />Quantum
              computers are scarce, so each portrait waits its turn in the machine's queue:
              usually about 3 minutes, start to picture, and up to 10 to 15 minutes at busy times.
            </p>
            <p class="cq-lpic__note">
              <Icon name="atom" :stroke-width="1.75" :size="14" class="cq-lpic__noteicon" />Qubitess
              runs on its own quantum time on IBM Cloud and AWS, and sends each portrait to the
              machine whose turn comes soonest.
            </p>
            <p class="cq-lpic__note">
              <LaunchGlyph name="coins" :stroke-width="1.75" width="14" height="14" class="cq-lpic__noteicon" />Quantum
              computer time costs the platform $96 a minute, and the platform covers it. So runs
              are strictly limited: 2 portraits a day each, one at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  </LaunchStep>
</template>

<style scoped>
.cq-lpic {
  display: grid;
  gap: clamp(15px, 2vw, 22px);
  min-width: 0;
}

/* intake ---------------------------------------------------------------- */
.cq-lpic__intake {
  display: grid;
  grid-template-columns: 128px minmax(0, 1fr);
  align-items: start;
  gap: clamp(14px, 2vw, 22px);
  min-width: 0;
}

.cq-lpic__drop {
  position: relative;
  display: grid;
  place-items: center;
  justify-self: start;
  width: 128px;
  height: 128px;
  overflow: hidden;
  cursor: pointer;
  background: var(--cq-sheet);
  border: 1px dashed var(--cq-line-strong);
  transition: border-color var(--cq-fast) var(--cq-ease);
}

.cq-lpic__drop:hover,
.cq-lpic__drop:focus-within {
  border-color: var(--cq-accent);
}

.cq-lpic__drop--filled {
  border-style: solid;
  border-color: var(--cq-line);
}

.cq-lpic__thumb {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cq-lpic__change {
  position: absolute;
  inset: auto 0 0 0;
  padding: 4px 0;
  background: color-mix(in srgb, var(--cq-sheet) 90%, transparent);
  font-family: var(--cq-mono);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  text-align: center;
  color: var(--cq-ink);
  opacity: 0;
  transition: opacity var(--cq-fast) var(--cq-ease);
}

.cq-lpic__drop:hover .cq-lpic__change,
.cq-lpic__drop:focus-within .cq-lpic__change {
  opacity: 1;
}

.cq-lpic__empty {
  display: grid;
  justify-items: center;
  gap: 7px;
  padding: 0 10px;
  text-align: center;
  font-size: 0.71rem;
  line-height: 1.35;
  color: var(--cq-muted);
}

.cq-lpic__emptyicon {
  color: var(--cq-accent-text);
}

.cq-lpic__quantum {
  display: grid;
  min-width: 0;
  border-top: 1px solid var(--cq-ink);
  border-left: 2px solid var(--cq-accent);
}

.cq-lpic__quantum--open {
  border-left-color: var(--cq-accent);
  background: var(--cq-sheet);
}

.cq-lpic__quantum-head {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  min-width: 0;
  padding: 12px 0 11px 14px;
}

.cq-lpic__glyph {
  margin-top: 2px;
  color: var(--cq-accent-text);
}

.cq-lpic__quantum-copy {
  display: grid;
  gap: 3px;
  flex: 1 1 auto;
  min-width: 0;
}

.cq-lpic__quantum-title {
  font-family: var(--cq-display);
  font-size: 1.02rem;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--cq-ink);
}

.cq-lpic__chev {
  transition: transform var(--cq-fast) var(--cq-ease);
}

.cq-lpic__chev--up {
  transform: rotate(180deg);
}

.cq-lpic__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px 16px;
  padding: 10px 0 12px 14px;
  border-top: 1px solid var(--cq-line);
}

.cq-lpic__fact {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.cq-lpic__term {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--cq-mono);
  font-size: 0.61rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cq-accent-text);
}

.cq-lpic__factic {
  flex: 0 0 auto;
}

.cq-lpic__def {
  font-size: 0.7rem;
  line-height: 1.45;
  color: var(--cq-muted);
  overflow-wrap: anywhere;
}

/* quantum portrait screen ----------------------------------------------- */
.cq-lpic__screen {
  position: relative;
  display: grid;
  min-width: 0;
  border: 1px solid var(--cq-line-strong);
  background: var(--cq-sheet);
}

.cq-lpic__tick {
  position: absolute;
  width: 9px;
  height: 9px;
  border: 0 solid var(--cq-accent);
  pointer-events: none;
  z-index: 2;
}

.cq-lpic__tick--tl {
  top: -1px;
  left: -1px;
  border-top-width: 2px;
  border-left-width: 2px;
}

.cq-lpic__tick--tr {
  top: -1px;
  right: -1px;
  border-top-width: 2px;
  border-right-width: 2px;
}

.cq-lpic__tick--bl {
  bottom: -1px;
  left: -1px;
  border-bottom-width: 2px;
  border-left-width: 2px;
}

.cq-lpic__tick--br {
  bottom: -1px;
  right: -1px;
  border-bottom-width: 2px;
  border-right-width: 2px;
}

.cq-lpic__screenbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  padding: 8px 12px;
  border-bottom: 1px solid var(--cq-line);
}

.cq-lpic__screenlabel {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  font-family: var(--cq-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cq-accent-text);
}

.cq-lpic__screengrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding: 14px;
  border-bottom: 1px solid var(--cq-line);
}

.cq-lpic__fig {
  display: grid;
  gap: 7px;
  min-width: 0;
}

.cq-lpic__shot,
.cq-lpic__screenempty {
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid var(--cq-line);
}

.cq-lpic__shot {
  object-fit: cover;
}

.cq-lpic__screenempty {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  border-style: dashed;
  background: var(--cq-sheet-soft);
  text-align: center;
  font-size: 0.73rem;
  color: var(--cq-muted);
  transition: border-color var(--cq-fast) var(--cq-ease);
}

.cq-lpic__screenempty:hover {
  border-color: var(--cq-accent);
}

.cq-lpic__screenemptyicon {
  color: var(--cq-accent-text);
}

.cq-lpic__cap {
  font-family: var(--cq-mono);
  font-size: 0.61rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  text-align: center;
  color: var(--cq-muted);
  overflow-wrap: anywhere;
}

.cq-lpic__cap--accent {
  color: var(--cq-accent-text);
}

.cq-lpic__plate {
  position: relative;
  display: grid;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid #171610;
  background: #171610;
}

.cq-lpic__state {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 12px;
  padding: 12px;
  text-align: center;
}

.cq-lpic__state--over {
  background: color-mix(in srgb, #171610 55%, transparent);
}

.cq-lpic__big {
  color: #b9baff;
}

.cq-lpic__seal {
  width: 92%;
  height: 92%;
  margin: auto;
}

.cq-lpic__gate {
  padding: 2px 6px;
  background: color-mix(in srgb, #171610 80%, transparent);
  font-family: var(--cq-mono);
  font-size: 0.6rem;
  letter-spacing: 0.04em;
  color: #c9d0ff;
}

.cq-lpic__status {
  position: absolute;
  inset: auto 8px 8px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  padding: 4px 8px;
  background: color-mix(in srgb, #171610 85%, transparent);
  font-family: var(--cq-mono);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #c9d0ff;
}

.cq-lpic__statustxt {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cq-lpic__notes {
  display: grid;
  gap: 12px;
  padding: 14px;
}

.cq-lpic__caution {
  display: grid;
  gap: 10px;
  padding: 10px 0 10px 14px;
  border-left: 2px solid var(--cq-warn);
}

.cq-lpic__note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.76rem;
  line-height: 1.5;
  color: var(--cq-warn);
}

.cq-lpic__noteicon {
  flex: 0 0 auto;
  margin-top: 2px;
}

@media (max-width: 760px) {
  .cq-lpic__facts {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .cq-lpic__intake {
    grid-template-columns: minmax(0, 1fr);
  }

  .cq-lpic__quantum-head {
    flex-wrap: wrap;
  }

  .cq-lpic__screengrid {
    gap: 10px;
    padding: 10px;
  }
}
</style>
