// Quick visual checkpoint: load a URL and save a full-page screenshot.
// Uses the rebrand skill's zero-dependency CDP driver.
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const chromeLib = 'C:/Users/Administrator/.dsh/skills/rebrand/scripts/lib/chrome.mjs';
const { launchChrome, openPage, findChrome } = await import(pathToFileURL(chromeLib).href);

const url = process.argv[2] || 'http://127.0.0.1:4310/';
const out = process.argv[3] || 'E:/workspace/chuangye/solana/mathlana/website/.reskin/preview/shot.png';
const width = Number(process.argv[4] || 1440);
const height = Number(process.argv[5] || 900);

const browser = await launchChrome({ executablePath: findChrome(), headless: true, proxy: null, width, height });
const page = await openPage(browser.cdp, { width, height });
try {
  await page.navigate(url, { timeoutMs: 45000, delayMs: 2200, width, height });
  const shot = await page.screenshot(out, { width, height, fullPage: true });
  const text = await page.bodyText();
  console.log(JSON.stringify({ ok: true, screenshot: shot.path, chars: text.length, text: text.slice(0, 300) }, null, 2));
} finally {
  await browser.close();
}
