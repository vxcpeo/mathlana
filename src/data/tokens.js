/**
 * Token directory. Live numbers come from `/api/market?mints=…`; the entries
 * below carry the identity metadata plus the snapshot used when the endpoint
 * is unreachable.
 */

/** The platform's own token, pinned to the top of the directory. */
export const OFFICIAL_TOKEN = {
  mint: "sL9DG8BYMZQz4sJ8FdLPrSUWLAPqqNHBJ7zdZYTpump",
  name: "Qubitlane",
  ticker: "$QUBITLANE",
  official: true,
  creator: "Qubitlane",
  createdAt: null,
  challengeSlug: null,
  graduated: true,
  fallback: {
    marketCapUsd: 89179,
    priceUsd: 0.0001255,
    change24h: 201,
    volume24hUsd: 103814.22,
    curve: 1,
    graduated: true,
  },
};

/** Regular tokens, newest first. */
export const TOKENS = [
  {
    mint: "47X58Wy6mCEW9w5uxedBHJbL14Ryh6TCngMDAjr5M6no",
    name: "Quantum Sword Cat",
    ticker: "$QSC",
    creator: "fdW7VZdJ9vJ8Yq2mLpQxN4rTcKbHs6UaGw3En5ZiVZdJ",
    createdAt: "2026-10-13T19:41:17.989Z",
    challengeSlug: "proximity",
    challengeLabel: "The Proximity Prize, upper bound",
    challengeVerb: "Defend",
    challengeDescription: "Where a forger provably starts to win",
    sessions: 0,
    verified: false,
    fallback: {
      marketCapUsd: 3460.9817114932,
      priceUsd: 0.0000034609817114932,
      change24h: 8.28,
      volume24hUsd: 917.03,
      curve: 0.094,
      graduated: false,
    },
  },
  {
    mint: "CaRw5kwse6QyPzyRfcr7VHAMbnog3QYJjn1egMVUCBe1",
    name: "Quantum Sword Cat",
    ticker: "$QSC",
    creator: "fdW7VZdJ9vJ8Yq2mLpQxN4rTcKbHs6UaGw3En5ZiVZdJ",
    createdAt: "2026-10-13T19:39:33.641Z",
    challengeSlug: "proximity",
    challengeLabel: "The Proximity Prize, upper bound",
    challengeVerb: "Defend",
    challengeDescription: "Where a forger provably starts to win",
    sessions: 0,
    verified: false,
    fallback: {
      marketCapUsd: 3696.27571464,
      priceUsd: 0.0000036962757146399998,
      change24h: 20.55,
      volume24hUsd: 712.5,
      curve: 0.1404,
      graduated: false,
    },
  },
  {
    mint: "GshGPrVBvnbhmrtxTBWjGGU33gKSd9Yb8bzRGc9KDRqa",
    name: "Quantum Shiba Inu",
    ticker: "$QSI",
    creator: "J5XRbk1pQ8mVn3sTzWc7dYfL2hGaPqR9uXe4Nk6Mbk1p",
    createdAt: "2026-10-10T18:27:53.080Z",
    challengeSlug: "sig-golf",
    challengeLabel: "sig.golf",
    challengeVerb: "Defend",
    challengeDescription: "Each step down makes safe signatures cheaper",
    sessions: 0,
    verified: false,
    fallback: {
      marketCapUsd: 3191.6580028964,
      priceUsd: 0.0000031916580028964,
      change24h: null,
      volume24hUsd: 103.09,
      curve: 0.042,
      graduated: false,
    },
  },
];

export const ALL_TOKENS = [OFFICIAL_TOKEN, ...TOKENS];

export const ALL_MINTS = ALL_TOKENS.map((t) => t.mint);

/** Filter tabs on /tokens. */
export const TOKEN_FILTERS = [
  { key: "new", label: "New" },
  { key: "researching", label: "Researching" },
  { key: "results", label: "With results" },
];

/** "Research log" rows shown in the sidebar card. */
export const RESEARCH_LOG = [
  { ticker: "$QSC", action: "launched", at: "2026-10-13T20:00:00.000Z" },
  { ticker: "$QSC", action: "launched", at: "2026-10-13T19:45:00.000Z" },
  { ticker: "$QSI", action: "launched", at: "2026-10-10T18:30:00.000Z" },
];
