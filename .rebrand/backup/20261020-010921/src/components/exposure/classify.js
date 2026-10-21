/**
 * Offline address classification for the exposure check.
 *
 * Everything here runs in the browser: no request leaves the page and nothing
 * is persisted. We can read what an address *is* — which chain, which script
 * type, and therefore whether a public key is on chain, behind a hash, or
 * absent — but we never claim to have read a balance.
 *
 * Copy is the reference site's own wording (see the catalogue shipped in
 * `_reference/netlog/exposure.dom.html`).
 */

/** Names for the reference's `exposure.check.chain.*` strings. */
export const CHAIN_LABELS = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Solana",
};

/** `exposure.check.type.*` */
export const TYPE_LABELS = {
  p2pk: "Public key (P2PK)",
  p2pkh: "Legacy (P2PKH)",
  p2sh: "Script hash (P2SH)",
  p2wpkh: "Native SegWit (P2WPKH)",
  p2wsh: "SegWit script (P2WSH)",
  p2tr: "Taproot (P2TR)",
  ethereum: "Ethereum account",
  solana: "Ed25519 address",
  extended: "Wallet key",
};

/** `exposure.check.visibility.*` and `exposure.check.short.*` */
export const VISIBILITY = {
  public: { label: "Key public", icon: "eye", tone: "text-caution-text", badge: "caution" },
  hidden: { label: "Key hidden", icon: "eye-off", tone: "text-brand-text", badge: "brand" },
  noKey: { label: "No key", icon: "code-xml", tone: "text-quiet-text", badge: "quiet" },
  watch: { label: "Watching key", icon: "key-round", tone: "text-note-text", badge: "note" },
};

export const SHORT = {
  publicKey: "Paid to a bare public key",
  keyHashReceived: "Received, never spent: key hidden",
  keyHashUnused: "No transactions yet: key hidden",
  scriptHashReceived: "Never spent: script and keys hidden",
  scriptHashUnused: "No transactions yet: script hidden",
  taproot: "Taproot: the address is a key",
  ethereumSent: "A key is public from its first transaction",
  ethereumUnused: "Never sent a transaction: key likely hidden",
  solanaKey: "On Solana the address is the key",
  solanaProgram: "A program's address: no key",
  watchingKey: "A Bitcoin wallet key: every address it made is checked",
};

/** `exposure.check.problem.*` */
export const PROBLEM = {
  empty: "Paste an address or a wallet key to check.",
  secret:
    "That looks like a private key or a recovery phrase (or a transaction id), not an address. It was not sent anywhere. No check ever needs a private key: never paste one into a website.",
  extendedKey:
    "Paste a Bitcoin xpub, ypub or zpub on its own. Multisig keys (Ypub, Zpub) and test network keys are not read.",
  tooMany: "Up to 20 addresses at a time.",
  name: "Paste the address itself, not a name.",
  testnet: "That is a Bitcoin test network address. This check reads the main network only.",
  checksum:
    "That {chain} address has a typo: its checksum does not match. Copy it again from your wallet.",
  segwitVersion: "That Bitcoin address uses a SegWit version this check does not read.",
  invalid: "That is not a valid {chain} address.",
  unknown: "That is not a Bitcoin, Ethereum or Solana address, or a Bitcoin wallet key.",
  at: "Entry {at}: {text}",
};

export const MAX_ADDRESSES = 20;

const EMPTY_COUNTS = { public: 0, hidden: 0, noKey: 0, watch: 0 };

/* ------------------------------------------------------------------ *
 * Base58
 * ------------------------------------------------------------------ */

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BASE58_MAP = (() => {
  const map = new Map();
  for (let i = 0; i < BASE58.length; i += 1) map.set(BASE58[i], i);
  return map;
})();

function base58Decode(input) {
  if (!input || typeof input !== "string") return null;
  const bytes = [];
  for (const char of input) {
    const value = BASE58_MAP.get(char);
    if (value === undefined) return null;
    let carry = value;
    for (let i = 0; i < bytes.length; i += 1) {
      carry += bytes[i] * 58;
      bytes[i] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  // Every leading "1" is a leading zero byte of its own.
  let zeros = 0;
  while (zeros < input.length && input[zeros] === "1") zeros += 1;
  const out = new Uint8Array(zeros + bytes.length);
  for (let i = 0; i < bytes.length; i += 1) out[zeros + i] = bytes[bytes.length - 1 - i];
  return out;
}

/* ------------------------------------------------------------------ *
 * SHA-256 (needed for Base58Check; WebCrypto is async and optional)
 * ------------------------------------------------------------------ */

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const rotr = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0;

function sha256(bytes) {
  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const padded = new Uint8Array((((bytes.length + 9) >> 6) + 1) << 6);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  const bits = bytes.length * 8;
  view.setUint32(padded.length - 8, Math.floor(bits / 2 ** 32), false);
  view.setUint32(padded.length - 4, bits >>> 0, false);

  const w = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i += 1) w[i] = view.getUint32(offset + i * 4, false);
    for (let i = 16; i < 64; i += 1) {
      const a = w[i - 15];
      const b = w[i - 2];
      const s0 = rotr(a, 7) ^ rotr(a, 18) ^ (a >>> 3);
      const s1 = rotr(b, 17) ^ rotr(b, 19) ^ (b >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i += 1) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0;
    h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0;
    h[7] = (h[7] + hh) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  for (let i = 0; i < 8; i += 1) outView.setUint32(i * 4, h[i], false);
  return out;
}

function sha256d(bytes) {
  return sha256(sha256(bytes));
}

function base58CheckDecode(input) {
  const decoded = base58Decode(input);
  if (!decoded || decoded.length < 5) return null;
  const payload = decoded.subarray(0, decoded.length - 4);
  const checksum = decoded.subarray(decoded.length - 4);
  const expected = sha256d(payload).subarray(0, 4);
  for (let i = 0; i < 4; i += 1) if (checksum[i] !== expected[i]) return null;
  return payload;
}

/* ------------------------------------------------------------------ *
 * Bech32 / bech32m (BIP-173, BIP-350)
 * ------------------------------------------------------------------ */

const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

function polymod(values) {
  let chk = 1;
  for (const value of values) {
    const top = chk >>> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ value;
    for (let i = 0; i < 5; i += 1) if ((top >> i) & 1) chk ^= GENERATOR[i];
  }
  return chk >>> 0;
}

function hrpExpand(hrp) {
  const out = [];
  for (const char of hrp) out.push(char.charCodeAt(0) >> 5);
  out.push(0);
  for (const char of hrp) out.push(char.charCodeAt(0) & 31);
  return out;
}

function bech32Decode(input) {
  if (input.length < 8 || input.length > 90) return null;
  const lower = input.toLowerCase();
  if (input !== lower && input !== input.toUpperCase()) return null;
  const split = lower.lastIndexOf("1");
  if (split < 1 || split + 7 > lower.length) return null;
  const hrp = lower.slice(0, split);
  const data = [];
  for (const char of lower.slice(split + 1)) {
    const value = CHARSET.indexOf(char);
    if (value === -1) return null;
    data.push(value);
  }
  const checksum = polymod(hrpExpand(hrp).concat(data));
  const encoding = checksum === 1 ? "bech32" : checksum === 0x2bc830a3 ? "bech32m" : null;
  if (!encoding) return null;
  return { hrp, data: data.slice(0, -6), encoding };
}

function convertBits(data, from, to) {
  let acc = 0;
  let bits = 0;
  const out = [];
  const maxv = (1 << to) - 1;
  for (const value of data) {
    if (value < 0 || value >> from !== 0) return null;
    acc = (acc << from) | value;
    bits += from;
    while (bits >= to) {
      bits -= to;
      out.push((acc >> bits) & maxv);
    }
  }
  if (bits >= from || ((acc << (to - bits)) & maxv)) return null;
  return out;
}

/* ------------------------------------------------------------------ *
 * Known script-less addresses (programs and contracts: no private key)
 * ------------------------------------------------------------------ */

const SOLANA_PROGRAMS = new Set([
  "11111111111111111111111111111111",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  "ComputeBudget111111111111111111111111111111",
  "Vote111111111111111111111111111111111111111",
  "Stake11111111111111111111111111111111111111",
  "Config1111111111111111111111111111111111111",
  "BPFLoaderUpgradeab1e11111111111111111111111",
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
  "SysvarRent111111111111111111111111111111111",
]);

/** BIP-32 version bytes we understand. */
const EXTENDED_VERSIONS = {
  0x0488b21e: { prefix: "xpub", network: "main", read: true },
  0x049d7cb2: { prefix: "ypub", network: "main", read: true },
  0x04b24746: { prefix: "zpub", network: "main", read: true },
  0x0295b43f: { prefix: "Ypub", network: "main", read: false },
  0x02aa7ed3: { prefix: "Zpub", network: "main", read: false },
  0x043587cf: { prefix: "tpub", network: "test", read: false },
  0x044a5262: { prefix: "upub", network: "test", read: false },
  0x045f1cf6: { prefix: "vpub", network: "test", read: false },
};

const WIF_VERSION = 0x80;
const P2PKH_VERSION = 0x00;
const P2SH_VERSION = 0x05;
const TESTNET_P2PKH = 0x6f;
const TESTNET_P2SH = 0xc4;

const HEX_PRIVATE_KEY = /^(0x)?[0-9a-fA-F]{64}$/;
const ETH_ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const MNEMONIC = /^[a-z]{3,8}(\s+[a-z]{3,8}){11,23}$/;
const NAME = /^[^\s]+\.[a-z]{2,}$/i;
const BECH32_PREFIX = /^(bc|tb|bcrt)1/i;

/* ------------------------------------------------------------------ *
 * The classifier
 * ------------------------------------------------------------------ */

function problem(text, at) {
  return at ? PROBLEM.at.replace("{at}", String(at)).replace("{text}", text) : text;
}

function entryFor(raw, fields) {
  return { raw, kind: "address", ...fields };
}

/**
 * Classify one pasted line.
 *
 * @returns {{ entry?: object, problem?: string, watch?: object }}
 */
function classifyLine(raw) {
  const text = raw.trim();

  // A private key, a seed phrase or a transaction id — never an address.
  if (HEX_PRIVATE_KEY.test(text) || MNEMONIC.test(text)) {
    return { problem: PROBLEM.secret };
  }

  // BIP-32 extended public keys.
  if (/^(xpub|ypub|zpub|Ypub|Zpub|tpub|upub|vpub)/.test(text) || /^[A-Za-z0-9]{100,120}$/.test(text)) {
    const payload = base58CheckDecode(text);
    if (payload && payload.length >= 4) {
      const version = ((payload[0] << 24) | (payload[1] << 16) | (payload[2] << 8) | payload[3]) >>> 0;
      const known = EXTENDED_VERSIONS[version];
      if (known && !known.read) return { problem: PROBLEM.extendedKey };
      if (known && known.read) {
        return {
          watch: {
            raw: text,
            kind: "watch",
            chain: "bitcoin",
            type: "extended",
            prefix: known.prefix,
            visibility: "watch",
            short: SHORT.watchingKey,
          },
        };
      }
    }
    if (/^(xpub|ypub|zpub|Ypub|Zpub|tpub|upub|vpub)/.test(text)) {
      return { problem: PROBLEM.extendedKey };
    }
  }

  // Ethereum.
  if (/^0x/i.test(text)) {
    if (ETH_ADDRESS.test(text)) {
      return {
        entry: entryFor(text, {
          address: text,
          chain: "ethereum",
          type: "ethereum",
          visibility: "public",
          short: SHORT.ethereumSent,
        }),
      };
    }
    return { problem: PROBLEM.invalid.replace("{chain}", CHAIN_LABELS.ethereum) };
  }

  // Bech32 / bech32m Bitcoin.
  if (BECH32_PREFIX.test(text) || /^bcrt1/i.test(text)) {
    const decoded = bech32Decode(text);
    if (!decoded) {
      return { problem: PROBLEM.checksum.replace("{chain}", CHAIN_LABELS.bitcoin) };
    }
    if (decoded.hrp !== "bc") return { problem: PROBLEM.testnet };
    const version = decoded.data[0];
    const program = convertBits(decoded.data.slice(1), 5, 8);
    if (program === null) {
      return { problem: PROBLEM.checksum.replace("{chain}", CHAIN_LABELS.bitcoin) };
    }
    if (version === 0 && decoded.encoding !== "bech32") {
      return { problem: PROBLEM.checksum.replace("{chain}", CHAIN_LABELS.bitcoin) };
    }
    if (version === 0 && program.length === 20) {
      return {
        entry: entryFor(text, {
          address: text,
          chain: "bitcoin",
          type: "p2wpkh",
          visibility: "hidden",
          short: SHORT.keyHashUnused,
          spend:
            "The key stays behind a hash until this address spends; spending all of it at once leaves no change behind.",
        }),
      };
    }
    if (version === 0 && program.length === 32) {
      return {
        entry: entryFor(text, {
          address: text,
          chain: "bitcoin",
          type: "p2wsh",
          visibility: "hidden",
          short: SHORT.scriptHashUnused,
        }),
      };
    }
    if (version === 1 && program.length === 32 && decoded.encoding === "bech32m") {
      return {
        entry: entryFor(text, {
          address: text,
          chain: "bitcoin",
          type: "p2tr",
          visibility: "public",
          short: SHORT.taproot,
        }),
      };
    }
    return { problem: PROBLEM.segwitVersion };
  }

  // Base58Check Bitcoin.
  const payload = base58CheckDecode(text);
  if (payload && payload[0] === WIF_VERSION) return { problem: PROBLEM.secret };
  if (payload && payload.length === 21) {
    const version = payload[0];
    if (version === TESTNET_P2PKH || version === TESTNET_P2SH) return { problem: PROBLEM.testnet };
    if (version === P2PKH_VERSION) {
      return {
        entry: entryFor(text, {
          address: text,
          chain: "bitcoin",
          type: "p2pk",
          visibility: "public",
          short: SHORT.publicKey,
          spend:
            "The earliest coins paid the key itself, so it is on chain already. When you spend, spend everything at once and let the change go to a fresh address.",
        }),
      };
    }
    if (version === P2SH_VERSION) {
      return {
        entry: entryFor(text, {
          address: text,
          chain: "bitcoin",
          type: "p2sh",
          visibility: "hidden",
          short: SHORT.scriptHashReceived,
        }),
      };
    }
  }

  // Solana: a bare 32-byte Ed25519 key in base58. Tested before the Bitcoin
  // heuristics, because the system program is thirty-two "1"s.
  const solana = base58Decode(text);
  if (solana && solana.length === 32 && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(text)) {
    const program = SOLANA_PROGRAMS.has(text);
    return {
      entry: entryFor(text, {
        address: text,
        chain: "solana",
        type: "solana",
        visibility: program ? "noKey" : "public",
        short: program ? SHORT.solanaProgram : SHORT.solanaKey,
      }),
    };
  }

  // A Bitcoin-looking address whose checksum failed.
  if (/^[13][1-9A-HJ-NP-Za-km-z]{25,40}$/.test(text)) {
    return { problem: PROBLEM.checksum.replace("{chain}", CHAIN_LABELS.bitcoin) };
  }

  if (NAME.test(text) && !/\s/.test(text)) return { problem: PROBLEM.name };

  return { problem: PROBLEM.unknown };
}

/**
 * Read a whole paste.
 *
 * @param {string} input
 * @returns {{
 *   entries: object[],
 *   problems: string[],
 *   over: boolean,
 *   counts: { public: number, hidden: number, noKey: number, watch: number },
 * }}
 */
export function analyse(input) {
  const lines = String(input ?? "")
    .split(/[\r\n,;]+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const entries = [];
  const watches = [];
  const problems = [];

  lines.forEach((line, index) => {
    const result = classifyLine(line);
    if (result.entry) entries.push(result.entry);
    else if (result.watch) watches.push(result.watch);
    else problems.push(problem(result.problem, index + 1));
  });

  const empty = { entries: [], problems: [], over: false, counts: EMPTY_COUNTS };

  // A watching key is read on its own, exactly as the reference states.
  if (watches.length && (entries.length || watches.length > 1)) {
    return { ...empty, problems: [PROBLEM.extendedKey] };
  }

  // Over the cap: say so and read nothing, rather than read a partial paste.
  if (entries.length + watches.length > MAX_ADDRESSES) {
    return { ...empty, problems: [PROBLEM.tooMany], over: true };
  }

  const counts = {
    public: entries.filter((entry) => entry.visibility === "public").length,
    hidden: entries.filter((entry) => entry.visibility === "hidden").length,
    noKey: entries.filter((entry) => entry.visibility === "noKey").length,
    watch: watches.length,
  };

  return { entries: [...entries, ...watches], problems, over: false, counts };
}

/**
 * The one calm step that fits what was pasted. Copy is the reference's
 * `exposure.check.next.*`.
 */
export function nextStep(counts, entries) {
  const chains = new Set(entries.map((entry) => entry.chain));
  const exposed = entries.filter((entry) => entry.visibility === "public");

  if (!entries.length) return null;

  if (counts.public === 0 && counts.watch > 0) {
    return {
      title: "Keep the key hidden",
      body: "Receiving shows nothing; spending or signing shows the key. When you spend, spend everything at once and let the change go to a fresh address.",
    };
  }

  const bitcoin = exposed.filter((entry) => entry.chain === "bitcoin").length;
  const ethereum = exposed.filter((entry) => entry.chain === "ethereum").length;
  const solana = exposed.filter((entry) => entry.chain === "solana").length;

  if (solana && !bitcoin && !ethereum) {
    return {
      title: "Nothing to move today",
      body: "Every Solana address is its key, so a new one changes nothing. The fix has to come from the network itself, such as hash-based signatures; when it lands, move with your wallet's official tools. Be wary of anyone urging a fast move.",
    };
  }
  if (ethereum) {
    return {
      title: "When it is easy, keep savings in an account that has never signed",
      body: "No rush. Use another account for daily use, sign-ins and approvals, so the savings account never needs to sign. Large or shared wallets: follow your wallet's own guidance.",
    };
  }
  if (bitcoin) {
    return {
      title: "When it is easy, move savings to a fresh address",
      body: "No rush: hurried moves lose more money than anything else. Pick a new native SegWit address (bc1q) that has never spent, and when you spend from it, spend it all at once.",
    };
  }
  if (counts.noKey) {
    return {
      title: "Check the keys behind the contract",
      body: "A smart wallet or a multisig is as safe as the keys that sign for it. Paste its signers' addresses here to see theirs.",
    };
  }
  if (chains.size) {
    return {
      title: "Keep the key hidden",
      body: "Receiving shows nothing; spending or signing shows the key. When you spend, spend everything at once and let the change go to a fresh address.",
    };
  }
  return {
    title: "Nothing to move",
    body: "These addresses hold nothing now. Receive savings at a fresh address that has never spent or signed.",
  };
}

/** Everything the results panel needs, in one pass. */
export function readPaste(input) {
  const result = analyse(input);
  return { ...result, next: nextStep(result.counts, result.entries) };
}
