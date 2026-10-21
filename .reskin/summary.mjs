import fs from 'node:fs';
const v = JSON.parse(fs.readFileSync('.reskin/verification.json','utf8'));
console.log('failures', v.failures.length);
for (const p of v.gates.pages) {
  const s = p.structure || {};
  console.log(p.route.padEnd(26), p.passed ? 'PASS' : 'FAIL', 'fp', s.fingerprintSimilarity, 'lm', s.landmarkSimilarity, 'cls', s.classOverlap, 'failures', p.failures.length);
  for (const f of p.failures.slice(0,4)) console.log('   -', f.slice(0,180));
}
console.log('--- skeleton gate ---', JSON.stringify(v.gates.skeleton, null, 1));
