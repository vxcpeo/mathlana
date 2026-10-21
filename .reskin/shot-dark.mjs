import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/.reskin/tools/package.json');
const { chromium } = require('playwright-core');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const base = process.argv[2] || 'http://127.0.0.1:4499/';
const routes = (process.argv[3] || '/').split(',');
const outDir = '.reskin/preview';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: chrome, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
const page = await context.newPage();
for (const r of routes) {
  await page.goto(new URL(r, base).href, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1600);
  await page.evaluate(() => { document.documentElement.classList.add('dark'); });
  await page.waitForTimeout(200);
  const name = r === '/' ? 'home' : r.replace(/^\/+|\/+$/g, '').replace(/[^\w-]+/g, '-');
  await page.screenshot({ path: `${outDir}/${name}-dark.png`, fullPage: true });
  console.log('dark shot', name);
}
await browser.close();
