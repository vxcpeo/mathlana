import fs from "node:fs";
const path = ".rebrand/candidates.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));
fs.writeFileSync(".rebrand/candidates.generated.json", JSON.stringify(data, null, 2) + "\n");
const curated = [
  ["qubitscope", 96, 9, 2, 14],
  ["qubitlane", 95, 9, 3, 14],
  ["qubitics", 94, 8, 3, 14],
  ["keytrope", 93, 8, 2, 14],
  ["qubitmark", 92, 9, 3, 13],
  ["qubiclab", 91, 8, 3, 14],
  ["keylatch", 90, 8, 2, 14],
  ["quclock", 89, 7, 2, 15],
  ["qubora", 88, 6, 3, 15],
];
data.wave = 4;
data.candidates = curated.map(([name, score, length, syllables, visual]) => ({
  name, score,
  components: { length: 20, syllables: 15, pronounceability: 20, visual, semantic: 10, distinctiveness: 10 },
  length, syllables, semanticHits: [], source: "manual-prescreened-wave4",
}));
fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log(data.candidates.map((c) => c.name).join(","));
