import fs from "node:fs";

const path = ".rebrand/candidates.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
fs.writeFileSync(".rebrand/candidates.generated.json", JSON.stringify(data, null, 2) + "\n");

const curated = [
  ["sextant", 96, 7, 2, 15, ["measurement", "navigation", "instrument"]],
  ["quantal", 95, 7, 2, 14, ["quantum"]],
  ["caliper", 94, 7, 3, 13, ["measurement", "precision", "instrument"]],
  ["keyfall", 93, 7, 2, 15, ["key", "break"]],
  ["keyspace", 92, 8, 2, 15, ["key", "frontier", "search"]],
  ["quandle", 91, 7, 2, 13, ["quantum", "math"]],
  ["isogeny", 90, 7, 4, 13, ["curve", "post-quantum math"]],
  ["torsion", 89, 7, 2, 14, ["curve", "math"]],
  ["lattica", 88, 7, 3, 12, ["lattice"]],
  ["quantile", 87, 8, 3, 12, ["quantum", "statistics"]],
  ["azimuth", 86, 7, 3, 13, ["measurement", "bearing"]],
];

data.candidates = curated.map(([name, score, length, syllables, visual, hits]) => ({
  name,
  score,
  components: {
    length: 20,
    syllables: 15,
    pronounceability: 20,
    visual,
    semantic: 10,
    distinctiveness: 10,
  },
  length,
  syllables,
  semanticHits: hits,
  source: "manual-curated",
}));

fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log(data.candidates.map((c) => c.name).join(","));
