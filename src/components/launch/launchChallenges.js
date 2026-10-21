/**
 * Presentation layer for the launch page's challenge picker and preview rail.
 *
 * `LAUNCHABLE_CHALLENGES` (src/data/challenges.js) carries the numbers — value,
 * unit, hint — and the order the list renders in. The wording below is what the
 * reference page prints for each row and for the sticky preview's footer; it is
 * keyed by slug so it travels with the shared data instead of the view.
 */
import { LAUNCHABLE_CHALLENGES } from "@/data/challenges";

/** Group headers above the rows, in reference order. */
export const CHALLENGE_GROUPS = [
  { key: "defend", label: "Defend", icon: "shield", iconClass: "text-brand" },
  {
    key: "stress",
    label: "Stress test",
    icon: "crosshair",
    iconClass: "text-foreground/75",
  },
];

const WORDING = {
  "sig-golf": {
    group: "defend",
    icon: "signature",
    title: "sig.golf",
    subtitle: "Smaller hash-based signatures",
    label: "sig.golf",
    goal: "Each step down makes safe signatures cheaper",
  },
  "proximity-lower": {
    group: "defend",
    icon: "sigma",
    title: "Lower bound",
    subtitle: "The Proximity Prize",
    label: "The Proximity Prize, lower bound",
    goal: "Each bit halves a forger's odds",
  },
  "proximity-upper": {
    group: "defend",
    icon: "sigma",
    title: "Upper bound",
    subtitle: "The Proximity Prize",
    label: "The Proximity Prize, upper bound",
    goal: "Where a forger provably starts to win",
  },
  "ecdsa-fail": {
    group: "stress",
    icon: "cpu",
    title: "Point addition",
    subtitle: "ECDSA.fail",
    label: "ECDSA.fail, point addition",
    goal: "Each step down shrinks the machine an attack needs",
  },
  "q-day": {
    group: "stress",
    icon: "sigma",
    title: "Q-Day",
    subtitle: "Two-qubit steps for the whole attack",
    label: "Q-Day, the race to fit",
    goal: "Each step down brings the first honest break closer",
  },
};

/** The picker's rows: shared numbers plus the reference's wording. */
export const LAUNCH_CHALLENGE_ROWS = LAUNCHABLE_CHALLENGES.map((challenge) => {
  const wording = WORDING[challenge.slug] ?? {};
  return {
    slug: challenge.slug,
    value: challenge.value,
    unit: challenge.unit,
    group: wording.group ?? "defend",
    icon: wording.icon ?? "sigma",
    title: wording.title ?? challenge.name,
    subtitle: wording.subtitle ?? challenge.hint,
    label: wording.label ?? challenge.name,
    goal: wording.goal ?? challenge.hint,
  };
});

/** The row the reference has selected on first paint. */
export const DEFAULT_CHALLENGE = "proximity-upper";

export function challengeBySlug(slug) {
  return (
    LAUNCH_CHALLENGE_ROWS.find((row) => row.slug === slug) ??
    LAUNCH_CHALLENGE_ROWS[0]
  );
}
