import fs from 'node:fs';
const p = JSON.parse(fs.readFileSync('.reskin/baseline/pages.json','utf8'));
console.log('baseline generatedAt', p.generatedAt, 'baseUrl', p.baseUrl, 'inventoryHash', p.inventoryHash);
console.log('pngs', fs.readdirSync('.reskin/baseline').filter(f=>f.endsWith('.png')).length);
const inv = JSON.parse(fs.readFileSync('.reskin/baseline/inventory.json','utf8'));
console.log('baseline inventory hash', inv.contentContractHash.slice(0,12), 'archetype', inv.archetype.id);
