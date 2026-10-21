<script setup>
/** "How it works" — the four numbered steps on a dot rail. */
import Icon from "@/components/ui/Icon.vue";
import PanelCard from "@/components/ui/PanelCard.vue";
import CardArt from "@/components/art/CardArt.vue";

const STEPS = [
  {
    n: "01",
    title: "Launch a token",
    body: "Pick a challenge, name your token and sign once with your wallet.",
    cta: { label: "Launch a token", to: "/launch" },
  },
  {
    n: "02",
    title: "Fees fill the AI/Quantum pool",
    body: "60% of your token's fees go to its AI/Quantum pool. The pool pays for everything the token runs: its AI agent, its quantum computer runs and its computer time.",
    cta: null,
  },
  {
    n: "03",
    title: "The agent works live",
    body: "Every thought, search and proof edit streams in public, and replays.",
    cta: null,
  },
  {
    n: "04",
    title: "A machine checks it",
    body: "A result counts only when the challenge's own checker accepts it: Lean, or Mathlana's check.",
    cta: { label: "See the challenges", to: "/challenges" },
  },
];
</script>

<template>
  <section id="how" class="scroll-mt-28 border-t">
    <div class="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <PanelCard header-size="lg">
        <template #art>
          <span
            aria-hidden="true"
            class="pointer-events-none absolute -top-8 -right-8 bottom-1 flex items-center text-brand opacity-45 transition-[opacity,transform] duration-500 ease-out group-hover:-rotate-2 group-hover:opacity-80 motion-reduce:transition-none max-sm:hidden"
          >
            <span class="block h-[72%] w-auto translate-y-3 -rotate-[8deg]">
              <CardArt name="figure" class="h-full" />
            </span>
          </span>
        </template>

        <template #header>
          <h2 class="relative headline text-2xl sm:text-3xl">How it works</h2>
          <p class="relative mt-1.5 text-sm text-pretty text-muted-foreground sm:max-w-[60%]">
            From a token to a result a machine has checked, in four steps, all in public.
          </p>
        </template>

        <ol class="grid grid-cols-1 divide-y lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          <li
            v-for="step in STEPS"
            :key="step.n"
            class="relative flex flex-col gap-2 px-5 pt-6 pb-5 sm:px-6"
          >
            <span aria-hidden="true" class="absolute inset-x-0 top-0 h-px bg-brand-border" />
            <span
              aria-hidden="true"
              class="absolute top-0 left-5 size-2 -translate-y-1/2 rounded-full bg-brand sm:left-6"
            />
            <span class="font-mono text-xs text-brand-text figures">{{ step.n }}</span>
            <h3 class="font-heading text-base font-semibold tracking-[-0.01em]">
              {{ step.title }}
            </h3>
            <p class="text-[0.82rem] leading-relaxed text-pretty text-muted-foreground">
              {{ step.body }}
            </p>
            <RouterLink
              v-if="step.cta"
              :to="step.cta.to"
              class="group/step mt-auto flex w-fit items-center gap-1 pt-1 text-[0.82rem] font-medium text-brand-text outline-none hover:underline focus-visible:underline"
            >
              {{ step.cta.label }}
              <Icon
                name="arrow-right"
                class="size-3.5 transition-transform group-hover/step:translate-x-0.5"
              />
            </RouterLink>
          </li>
        </ol>
      </PanelCard>
    </div>
  </section>
</template>
