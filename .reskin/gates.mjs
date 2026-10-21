import fs from 'node:fs';
const v = JSON.parse(fs.readFileSync('.reskin/verification.json','utf8'));
let bad = 0;
for (const p of v.gates.pages) {
  for (const f of p.failures) {
    if (!/removed\/changed|added\/changed/.test(f)) { console.log(p.route, '::', f); bad++; }
  }
}
console.log('non-content failures:', bad);
console.log('warnings sample:');
for (const w of v.warnings.slice(0,12)) console.log('  ', w.slice(0,160));
