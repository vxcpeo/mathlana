import fs from 'node:fs';
const p = JSON.parse(fs.readFileSync('.reskin/baseline/pages.json','utf8'));
const d = p.pages['/'].desktop;
for (const w of ['Skip','to','content','Tokens','About']) {
  const e = d.words.find(x => x.word === w);
  console.log(w, e?.count ?? 0);
}
const c = JSON.parse(fs.readFileSync('.reskin/current/pages.json','utf8'));
const cd = c.pages['/'].desktop;
for (const w of ['Skip','to','content','Tokens','About']) {
  const e = cd.words.find(x => x.word === w);
  console.log('cur', w, e?.count ?? 0);
}
