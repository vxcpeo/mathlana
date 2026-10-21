import fs from "node:fs";
const path = ".rebrand/candidates.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
fs.writeFileSync(".rebrand/candidates.generated.json", JSON.stringify(data, null, 2) + "\n");
const curated = [
  ["keyscope", 96, 8, 2, 15],
  ["qubitscope", 95, 9, 2, 14],
  ["keybreak", 94, 8, 2, 15],
  ["cipherix", 93, 8, 3, 14],
  ["lattiva", 92, 7, 3, 14],
  ["qubira", 91, 6, 3, 15],
  ["quvora", 90, 6, 3, 15],
  ["shorline", 89, 8, 2, 14],
  ["keymark", 88, 7, 2, 14],
  ["quoril", 87, 6, 2, 14],
];
data.wave = 3;
data.candidates = curated.map(([name, score, length, syllables, visual]) => ({
  name, score,
  components: { length: 20, syllables: 15, pronounceability: 20, visual, semantic: 10, distinctiveness: 10 },
  length, syllables, semanticHits: [], source: "manual-curated-wave3",
}));
fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log(data.candidates.map((c) => c.name).join(","));
