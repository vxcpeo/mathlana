/**
 * Static content that the reference site ships in its bundle: the quantum
 * machine roster and the challenge registry.
 */

/** Quantum computers shown in the live ticker, in reference order. */
export const QUANTUM_MACHINES = [
  {
    maker: "IBM",
    model: "Kingston",
    qubits: 156,
    online: true,
    url: "https://quantum.cloud.ibm.com/computers?system=ibm_kingston",
  },
  {
    maker: "IBM",
    model: "Marrakesh",
    qubits: 156,
    online: true,
    url: "https://quantum.cloud.ibm.com/computers?system=ibm_marrakesh",
  },
  {
    maker: "Rigetti",
    model: "Cepheus-1-108Q",
    qubits: 107,
    online: true,
    url: "https://www.rigetti.com/what-we-build",
  },
  {
    maker: "IQM",
    model: "Emerald",
    qubits: 54,
    online: true,
    url: "https://www.meetiqm.com/products/iqm-emerald/",
  },
  {
    maker: "IQM",
    model: "Garnet",
    qubits: 20,
    online: true,
    url: "https://www.meetiqm.com/products/iqm-garnet/",
  },
  {
    maker: "IonQ",
    model: "Forte 1",
    qubits: 36,
    online: true,
    url: "https://ionq.com/quantum-systems/forte",
  },
  {
    maker: "AQT",
    model: "IBEX Q1",
    qubits: 12,
    online: true,
    url: "https://www.aqt.eu/qc-systems/ibex-q1/",
  },
  {
    maker: "IonQ",
    model: "Forte Enterprise 1",
    qubits: 36,
    online: false,
    url: "https://ionq.com/quantum-systems/forte-enterprise",
  },
];

/** Makers that get a wordmark instead of a plain text label in the ticker. */
export const MAKER_LOGOS = ["IBM", "Rigetti", "IQM", "IonQ", "AQT"];

/**
 * The two threat families the whole product is organised around.
 * `key` matches the visual accent used for the group header.
 */
export const THREAT_GROUPS = {
  quantum: {
    key: "quantum",
    icon: "atom",
    title: "Quantum computers",
    subtitle: "Shor's algorithm against crypto wallet keys",
  },
  math: {
    key: "math",
    icon: "sigma",
    title: "AI-accelerated math",
    subtitle: "Years of math in months: the risks and the way out",
  },
};

/**
 * Challenge registry. `metrics` mirrors what the site renders on the
 * challenges index; `slug` is the route under /challenges/.
 */
export const CHALLENGES = [
  {
    slug: "q-day",
    name: "Q-Day",
    host: null,
    hostLabel: "by Qubitlane",
    group: "quantum",
    verb: "Defend",
    icon: "atom",
    open: true,
    asks:
      "Build Shor's attack on practice elliptic-curve keys with real field arithmetic, in Python. Qubitlane checks every step on every point of the curve, runs the attack on a real quantum computer only when it can beat random guessing, and counts a level broken after three confirmed runs.",
    metrics: [
      {
        label: "Q-Day clock",
        description: "Keys broken on a real quantum computer",
        value: 0,
        unit: "bits",
        of: 256,
        direction: "higher",
        progress: 0,
        tokens: 0,
        note: "No token racing yet",
      },
    ],
  },
  {
    slug: "ecdsa-fail",
    name: "ECDSA.fail",
    host: "https://ecdsa.fail",
    hostLabel: "on ecdsa.fail",
    group: "quantum",
    verb: "Stress test",
    icon: "cpu",
    open: true,
    asks:
      "Build the cheapest reversible quantum circuit for one point addition on secp256k1, in Rust. A machine simulates it, and Qubitlane checks it again on 102,400 fresh inputs.",
    metrics: [
      {
        label: "Point addition",
        description: "Each step down shrinks the machine an attack needs",
        value: 1282404859,
        unit: "qubits × Toffoli",
        direction: "lower",
        start: 10758874395,
        startLabel: "from 10,758,874,395",
        improvement: "88.1%",
        improvementLabel: "88.1% smaller",
        progress: 88.1,
        tokens: 0,
        record: "ECDSA.fail's record 939,681,128",
        leaderboard: true,
      },
    ],
  },
  {
    slug: "sig-golf",
    name: "sig.golf",
    host: "https://yukon.org",
    hostLabel: "on Yukon",
    group: "math",
    verb: "Defend",
    icon: "signature",
    open: true,
    asks:
      "Design a stateless hash-based signature as four RISC-V programs, with Lean proofs that it is complete, cheap to verify and 127-bit secure.",
    why:
      "Signatures built only from a hash stay safe even if new math breaks elliptic curves. Smaller ones make that move affordable on chain.",
    metrics: [
      {
        label: "Signature bytes × verification cycles",
        description: "Each step down makes safe signatures cheaper",
        value: 37361160,
        unit: "byte·cycles",
        direction: "lower",
        start: 74113492,
        startLabel: "from 74,113,492",
        improvement: "49.6%",
        improvementLabel: "49.6% smaller",
        progress: 49.6,
        tokens: 1,
        leaderboard: true,
      },
    ],
  },
  {
    slug: "proximity",
    name: "The Proximity Prize",
    host: "https://better.codes",
    hostLabel: "on better.codes",
    group: "math",
    verb: "Defend",
    icon: "sigma",
    open: true,
    asks:
      "Prove in Lean how sound a Reed-Solomon proximity test is: a radius proven safe from below, and one proven unsafe from above.",
    metrics: [
      {
        label: "Lower bound",
        description: "Each bit halves a forger's odds",
        value: 68.15,
        unit: "bits",
        direction: "higher",
        start: 53.0,
        startLabel: "from 53.00 · Target 128 bits",
        progress: 20.2,
        improvementLabel: "20.2% of the way",
        tokens: 0,
        recordType: "Public record",
      },
      {
        label: "Upper bound",
        description: "Where a forger provably starts to win",
        value: 116.13,
        unit: "bits",
        direction: "lower",
        start: 128.0,
        startLabel: "from 128.00 · 9.3%",
        improvement: "9.3%",
        improvementLabel: "9.3% smaller",
        progress: 9.3,
        tokens: 2,
        leaderboard: true,
      },
    ],
  },
  {
    slug: "precompile-fast",
    name: "precompile.fast",
    host: null,
    hostLabel: null,
    group: "math",
    verb: null,
    icon: "shield",
    open: false,
    status: "Next",
    description:
      "The EVM's cryptography proven correct in Lean, with its gas measured.",
    note: "Not open for tokens yet. It opens here when its results can be checked the same way.",
    metrics: [],
  },
  {
    slug: "lattice-records",
    name: "Lattice records",
    host: null,
    hostLabel: null,
    group: "math",
    verb: null,
    icon: "crosshair",
    open: false,
    status: "Later",
    description:
      "Lattices such as ML-DSA and FHE, once a public venue checks results by machine.",
    note: "Not open for tokens yet. It opens here when its results can be checked the same way.",
    metrics: [],
  },
];

/** Challenges a token can be launched on (open ones only). */
export const LAUNCHABLE_CHALLENGES = [
  {
    slug: "sig-golf",
    verb: "Defend",
    name: "sig.golf",
    metric: "Signature bytes × verification cycles",
    value: "37,361,160",
    unit: "byte·cycles",
    hint: "Smaller hash-based signatures",
  },
  {
    slug: "proximity-lower",
    verb: "Lower bound",
    name: "The Proximity Prize",
    metric: "Lower bound",
    value: "68.15",
    unit: "bits",
    hint: "Bits proven safe",
  },
  {
    slug: "proximity-upper",
    verb: "Upper bound",
    name: "The Proximity Prize",
    metric: "Upper bound",
    value: "116.13",
    unit: "bits",
    hint: "Bits where it stops being safe",
  },
  {
    slug: "ecdsa-fail",
    verb: "Stress test",
    name: "ECDSA.fail",
    metric: "Point addition",
    value: "1,282,404,859",
    unit: "qubits × Toffoli",
    hint: "Point addition",
  },
  {
    slug: "q-day",
    verb: "Q-Day",
    name: "Q-Day",
    metric: "Two-qubit steps for the whole attack",
    value: "223,308",
    unit: "two-qubit steps",
    hint: "Two-qubit steps for the whole attack",
  },
];

/** NVDAx — every token trades against NVIDIA's tokenized stock on Solana. */
export const QUOTE_ASSET = {
  symbol: "NVDAx",
  name: "NVIDIA",
  logo: "/coins/nvdax.png",
  mint: "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
};
