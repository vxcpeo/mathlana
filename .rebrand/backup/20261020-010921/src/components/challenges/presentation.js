/**
 * Copy for the challenge pages.
 *
 * Every figure the site shows comes out of the registry in `@/data/challenges`;
 * this module carries the strings the reference renders around those figures
 * (headings, footnotes, "what's at stake" prose) plus the handful of display
 * details — icons, host spellings, leaderboard URLs, record labels — that the
 * registry does not keep. Everything here was read off the live page.
 */
import { group } from "@/lib/format";

/** `/challenges` masthead. */
export const CHALLENGES_PAGE = {
  title: "Challenges",
  subtitle:
    "Public problems that measure the two threats to today's keys, quantum computers and AI-accelerated math, and build the way out. A machine checks every result.",
};

/** The wide header card that fronts each threat group. */
export const GROUP_HEADERS = {
  quantum: { art: "orbit" },
  math: { art: "figure" },
};

/** Sub-label above each grid of cards inside a threat group. */
export const GROUP_LABELS = {
  quantum:
    "Elliptic curves (ECDSA, Ed25519): your wallet's keys, at risk from both threats",
  math: "Hash-based: the way out, made smaller and proven sound",
  lattices: "Lattices (ML-DSA, FHE): the new risk from AI math",
};

/**
 * Briefs where the registry's stored wording differs from the live page
 * (`1024` vs `102,400` fresh inputs, an en dash where the site uses a hyphen).
 */
const ASKS = {
  "ecdsa-fail":
    "Build the cheapest reversible quantum circuit for one point addition on secp256k1, in Rust. A machine simulates it, and Mathlana checks it again on 102,400 fresh inputs.",
  proximity:
    "Prove in Lean how sound a Reed-Solomon proximity test is: a radius proven safe from below, and one proven unsafe from above.",
};

/** The challenge's one-line brief, as the reference prints it. */
export function challengeAsks(challenge) {
  return ASKS[challenge.slug] ?? challenge.asks;
}

/**
 * Per-challenge display details for the index cards. `recordType` is the small
 * caption that sits under the metric value; `leaderboard` is where the metric's
 * "Official leaderboard" link points.
 */
export const CARD_COPY = {
  "q-day": {
    icon: "atom",
    hostLabel: "run by Mathlana",
    href: "/q-day",
    clockAriaLabel: "Open the Q-Day clock",
  },
  "ecdsa-fail": {
    icon: "cpu",
    hostLabel: "on ecdsa.fail",
    recordType: "Strict record",
    leaderboard: "https://ecdsa.fail",
  },
  "sig-golf": {
    icon: "signature",
    hostLabel: "on Yukon",
    recordType: "Public record",
    leaderboard: "https://yukon.org/sig.golf",
  },
  proximity: {
    icon: "sigma",
    hostLabel: "on better.codes",
    recordType: "Public record",
    leaderboard: "https://better.codes",
  },
  "precompile-fast": { icon: "shield", statusTone: "brand" },
  "lattice-records": { icon: "crosshair", statusTone: "quiet" },
};

/** `MetricLine`-style superscript used inside the reference's prose. */
const SUP = (text) =>
  `<sup class="relative -top-[0.5em] align-baseline text-[0.72em] leading-none">${text}</sup>`;

/** `/challenges/<slug>` detail copy, keyed by slug. */
export const CHALLENGE_DETAIL = {
  "sig-golf": {
    hostIcon: "signature",
    hostLabel: "on Yukon",
    verb: "Defend",
    verbIcon: "shield",
    verbIconClass: "text-brand",
    track: "sig-golf",
    ctaNote:
      "Checked by the challenge's own verifier. Mathlana runs the same Lean check first, within minutes.",
    leaderboard: "https://yukon.org/sig.golf",
    panels: [{ metric: 0, title: "sig.golf", recordLabel: "Public record" }],
    stakes: {
      kind: "single",
      id: "stakes-sig-golf",
      badge: { verb: "Defend", icon: "shield", iconClass: "text-brand" },
      protectsLabel: "Protects",
      protects:
        "Signatures built from a hash alone: the kind that stays safe if new math breaks the elliptic curves behind most wallets.",
      numberNote: ({ improvement }) =>
        `Signature bytes times the most RISC-V cycles a verifier needs for one. Lower means a safe signature that is cheaper to carry and check on chain. The record is ${improvement} below where it started.`,
      scaleRows: () => [
        { label: "Signature where it started", value: "6,404 bytes" },
        { label: "An elliptic-curve signature", value: "64 bytes" },
        { label: "Security every entry proves", value: "127 bits" },
      ],
      scaleNoteAfter: () =>
        `Where it started, a signature was about 100 times an elliptic-curve one. A forger making Q hash calls wins with odds of at most Q in 2${SUP("127")}: at a billion hash calls a second, that reaches one expected forgery only after about 5.4 × 10${SUP("21")} years.`,
      footnote:
        "Proven in Lean in the random-oracle model, against classical attackers: a quantum attacker is outside its game.",
      sourceHref: "https://github.com/Layr-Labs/sig.golf/blob/main/RULES.md",
    },
  },

  "ecdsa-fail": {
    hostIcon: "cpu",
    hostLabel: "on ecdsa.fail",
    verb: "Stress test",
    verbIcon: "crosshair",
    verbIconClass: "text-foreground/75",
    why: "This step is what a quantum computer repeats to recover a private key from a public key that is already visible. A cheaper step means a smaller machine would do. It is the clock for moving funds to fresh, hidden addresses.",
    track: "point-add",
    ctaNote:
      "Checked by Mathlana: the strict check, 102,400 fresh inputs drawn after the circuit is fixed. A circuit that beats ECDSA.fail's record without tuning for its public test is submitted there.",
    leaderboard: "https://ecdsa.fail",
    panels: [
      {
        metric: 0,
        title: "ECDSA.fail, point addition",
        recordLabel: "Strict record",
        extraRow: {
          labelNote: "Public test, grinding allowed",
          unit: "qubits × Toffoli",
        },
      },
    ],
    stakes: {
      kind: "single",
      id: "stakes-point-add",
      badge: { verb: "Stress test", icon: "crosshair", iconClass: "text-foreground/75" },
      protectsLabel: "Protects",
      protects:
        "The elliptic curve behind Bitcoin and Ethereum keys, attacked: a point addition is the step a quantum computer repeats to recover a private key from a public key that is already visible.",
      numberNote: () =>
        "Qubits times Toffoli gates for one point addition: the best circuit that passes Mathlana's strict check, 102,400 fresh inputs drawn after the circuit is fixed. Lower means a smaller future machine would do. No machine can run it today.",
      scaleRows: ({ challenge }) => [
        { label: "Where it started", value: group(challenge.metrics[0].start) },
        { label: "Strict record", value: group(challenge.metrics[0].value), tone: "proven" },
        { label: "ECDSA.fail's record (public test, grinding allowed)", value: recordValue(challenge.metrics[0]) },
      ],
      footnote:
        "A simulation of one step, not an attack: no quantum computer can run it today. The challenge's own terms say no score is a statement about the security of any asset.",
      sourceHref: "https://github.com/Layr-Labs/ecdsafail-challenge#readme",
    },
  },

  proximity: {
    hostIcon: "sigma",
    hostLabel: "on better.codes",
    verb: "Defend",
    verbIcon: "shield",
    verbIconClass: "text-brand",
    why: "Hash-based proof systems, the kind blockchains are moving to, rest on these bounds. Closing the gap means smaller proofs that anyone can trust.",
    track: "proximity-lower",
    ctaNote:
      "Checked by the challenge's own verifier. Mathlana runs the same Lean check first, within minutes.",
    leaderboard: "https://better.codes",
    panels: [
      {
        metric: 0,
        title: "The Proximity Prize, lower bound",
        recordLabel: "Public record",
        progressRight: "Target 128 bits",
      },
      {
        metric: 1,
        title: "The Proximity Prize, upper bound",
        recordLabel: "Public record",
      },
    ],
    stakes: {
      kind: "bounds",
      heading: "What's at stake",
      scaleIntro:
        "What each level means at a billion guesses a second: the time until one expected forgery.",
      scaleRows: [
        {
          label: "Proven safe at the start",
          value: "53.00 bits",
          when: "about 104 days",
        },
        {
          label: "Proven safe now",
          value: "68.15 bits",
          when: "about 10,000 years",
          tone: "proven",
        },
        {
          label: "Proven ceiling",
          value: "116.13 bits",
          when: `about 2.9 × 10${SUP("18")} years`,
        },
        {
          label: "The target",
          value: "128.00 bits",
          when: `about 1.1 × 10${SUP("22")} years`,
        },
      ],
      footnote:
        "One part of a proof system's security, not the whole: the challenge says so itself.",
      sourceHref: "https://github.com/proximity-prize/proximity-prize#readme",
      bounds: [
        {
          id: "stakes-proximity-lower",
          metric: 0,
          title: "Lower bound",
          badge: { verb: "Defend", icon: "shield", iconClass: "text-brand" },
          protectsLabel: "Protects",
          protects:
            "The hash-based proof systems blockchains are moving to. This bound proves how sound one of their tests is.",
          numberNote: ({ value }) =>
            `Bits proven safe: a forged proof slips past the test's 128 spot checks at most 1 time in 2${SUP(value)}. Each bit halves the odds.`,
        },
        {
          id: "stakes-proximity-upper",
          metric: 1,
          title: "Upper bound",
          badge: {
            verb: "Defend, attacker's side",
            icon: "shield",
            iconClass: "text-brand",
          },
          protectsLabel: "Attacks",
          protects:
            "The attacker's side of the same proof systems: where a forger provably starts to win.",
          numberNote: ({ value }) =>
            `A ceiling: past the radius it proves, the step that combines the rows lets a forgery through more than 1 time in 2${SUP("128")}, so no safe radius gives more than ${value} bits. Lower is tighter.`,
        },
      ],
    },
  },
};

/** Bits the proximity prize is measured against, used by its interval rail. */
export const PROXIMITY_TARGET_BITS = 128;

/** Copy for a slug that is not one of the public challenges. */
export const NOT_FOUND = {
  eyebrow: "Challenges",
  title: "No such challenge",
  body: "That link is not one of the public problems. The open ones, and the machines that check every result, are on the challenges page.",
  cta: "See the challenges",
};

/** `939,681,128` — pulled out of the registry's free-text record line. */
export function recordValue(metric) {
  if (!metric?.record) return null;
  return metric.record.slice(metric.record.lastIndexOf(" ") + 1);
}

/** `ECDSA.fail's record` — the label half of the record line. */
export function recordLabel(metric) {
  if (!metric?.record) return null;
  return metric.record.slice(0, metric.record.lastIndexOf(" "));
}

/** `68.15` stays two decimals; `37361160` becomes `37,361,160`. */
export function metricValue(metric) {
  return metric.unit === "bits" ? Number(metric.value).toFixed(2) : group(metric.value);
}

/** The same rule for the "where it started" figure. */
export function metricStart(metric) {
  return metric.unit === "bits" ? group(metric.start, 2) : group(metric.start);
}

/** `49.6%` — the percentage drawn next to the rail. */
export function metricPercent(metric) {
  return (
    metric.improvement ?? metric.improvementLabel?.match(/^[\d.]+%/)?.[0] ?? null
  );
}

/**
 * `from 74,113,492 · 49.6%`. The registry already folds the improvement into
 * some start labels (`from 128.00 · 9.3%`), so the explicit `improvement` is
 * only appended when it is not already there.
 */
export function metricFootnote(metric) {
  const percent = metric.improvement;
  const suffix = percent && !metric.startLabel.includes(percent) ? ` · ${percent}` : "";
  return `${metric.startLabel}${suffix}`;
}

/** "Lower is better" / "Higher is better". */
export function metricDirection(metric) {
  return metric.direction === "lower" ? "Lower is better" : "Higher is better";
}

