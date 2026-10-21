import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/.reskin/tools/package.json');
const { chromium } = require('playwright-core');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const base = process.argv[2] || 'http://127.0.0.1:4321/';
const routes = (process.argv[3] || '/').split(',');
const width = Number(process.argv[4] || 1440);
const outDir = '.reskin/preview';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: chrome, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width, height: width > 700 ? 900 : 844 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e.message || e)));
for (const r of routes) {
  const url = new URL(r, base).href;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1600);
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  const name = r === '/' ? 'home' : r.replace(/^\/+|\/+$/g, '').replace(/[^\w-]+/g, '-');
  await page.screenshot({ path: `${outDir}/${name}-${width}.png`, fullPage: true });
  console.log('shot', name, width);
}
if (errors.length) console.log('console errors:', errors.slice(0, 6));
await browser.close();

