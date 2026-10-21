<script setup>
/** "Is your money behind a public key?" banner. */
import Icon from "@/components/ui/Icon.vue";
import PanelCard from "@/components/ui/PanelCard.vue";

const CARDS = [
  {
    icon: "eye",
    title: "Money at risk",
    body: "How much sits behind a public key, and how much behind a hash.",
  },
  {
    icon: "compass",
    title: "One calm step",
    body: "The move that fits your wallet, never a hurried one.",
  },
  {
    icon: "key-round",
    title: "How close it is",
    body: "The Q-Day clock and the smallest known circuit, live.",
  },
];
</script>

<template>
  <section class="border-t">
    <div class="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <PanelCard art="orbit" art-responsive header-size="lg">
        <template #header>
          <p class="relative flex items-center gap-1.5 text-[0.8rem] font-medium text-brand-text">
            <Icon name="scan-line" class="size-4" />
            Exposure check
          </p>
          <h2 class="relative headline mt-1.5 text-2xl text-balance sm:text-3xl">
            Is your money behind a public key?
          </h2>
          <p class="relative mt-1.5 text-sm text-pretty text-muted-foreground sm:max-w-[60%]">
            Paste your addresses or a Bitcoin xpub. Nothing is stored, and no wallet connects.
          </p>
        </template>

        <ul class="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
          <li
            v-for="card in CARDS"
            :key="card.title"
            class="flex items-start gap-3 px-5 py-4 sm:px-6"
          >
            <Icon :name="card.icon" class="mt-0.5 size-4 shrink-0 text-brand-text" />
            <span class="flex min-w-0 flex-col gap-0.5">
              <span class="font-heading text-sm font-semibold tracking-[-0.01em]">{{
                card.title
              }}</span>
              <span class="text-[0.82rem] leading-relaxed text-pretty text-muted-foreground">{{
                card.body
              }}</span>
            </span>
          </li>
        </ul>

        <div class="flex justify-end border-t px-5 py-3 sm:px-6">
          <RouterLink
            to="/exposure"
            class="group/go flex items-center gap-1 text-sm font-medium text-brand-text outline-none hover:underline focus-visible:underline"
          >
            Check a wallet
            <Icon
              name="arrow-right"
              class="size-3.5 transition-transform group-hover/go:translate-x-0.5"
            />
          </RouterLink>
        </div>
      </PanelCard>
    </div>
  </section>
</template>
