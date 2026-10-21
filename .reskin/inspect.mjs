import fs from 'node:fs';
const p = JSON.parse(fs.readFileSync('.reskin/baseline/pages.json','utf8'));
for (const r of ['/', '/tokens', '/challenges', '/launch', '/terms']) {
  const d = p.pages[r].desktop;
  console.log(r, 'fingerprint', d.fingerprint.length, 'classes', d.classTokens.length, 'words', d.words.reduce((n,w)=>n+w.count,0));
  console.log('  landmarks:', d.landmarks.map(l=>`${l.tag}:${l.role}@${l.top}/${l.left} ${l.width}x${l.height}`).join(' | '));
  console.log('  classes sample:', d.classTokens.slice(0,25).join(' '));
}
const c = JSON.parse(fs.readFileSync('.reskin/baseline/content-contract.json','utf8'));
for (const w of ['Qubit','lane','Math','lana','Launch a token','Tokens','Legal','Product','Sign in','Live quantum computer stats','Skip to content']) {
  const e = c.visibleText.find(x=>x.value===w) || c.hiddenText.find(x=>x.value===w);
  console.log('token', JSON.stringify(w), e?.count ?? 0);
}
console.log('colorVars:', JSON.parse(fs.readFileSync('.reskin/inventory.json','utf8')).designSignals.colorVars.filter(v=>/accent|primary|brand|highlight/i.test(v.name)));
