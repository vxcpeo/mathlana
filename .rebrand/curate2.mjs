import fs from "node:fs";

const path = ".rebrand/candidates.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
fs.writeFileSync(".rebrand/candidates.generated.json", JSON.stringify(data, null, 2) + "\n");

const curated = [
  ["keyvane", 96, 7, 2, 15],
  ["qubora", 95, 6, 3, 15],
  ["calipra", 94, 7, 3, 14],
  ["primora", 93, 7, 3, 14],
  ["keyrune", 92, 7, 2, 15],
  ["ciphera", 91, 7, 3, 14],
  ["sextara", 90, 7, 3, 13],
  ["quantel", 89, 7, 2, 14],
  ["lattix", 88, 6, 2, 13],
  ["quorix", 87, 6, 2, 13],
];

data.wave = 2;
data.candidates = curated.map(([name, score, length, syllables, visual]) => ({
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
  semanticHits: [],
  source: "manual-curated-wave2",
}));

fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log(data.candidates.map((c) => c.name).join(","));
