import fs from 'node:fs';
import { analyzeProject, contractDiff } from 'file:///C:/Users/Administrator/.dsh/skills/reskin/scripts/inventory.mjs';
const base = JSON.parse(fs.readFileSync('.reskin/baseline/inventory.json','utf8')).contentContract;
const cur = await analyzeProject(process.cwd());
const diff = contractDiff(base, cur.contentContract, { allowAdditions: true });
const issues = [...diff.issues];
const promote = [];
for (let i = diff.warnings.length - 1; i >= 0; i--) {
  if (/^(visibleText|i18n|forms): (?:added|".*" count increased)/.test(diff.warnings[i])) promote.push(diff.warnings.splice(i,1)[0]);
}
console.log('blocking issues:', issues.length + promote.length);
for (const x of [...issues, ...promote].slice(0, 30)) console.log('  -', x);
console.log('warnings:', diff.warnings.length);
for (const x of diff.warnings.slice(0, 25)) console.log('  ~', x);
console.log('hash', cur.contentContractHash);
