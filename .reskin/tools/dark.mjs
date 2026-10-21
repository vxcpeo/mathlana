// Dark-edition checkpoint: set the theme to dark, reload, screenshot a route.
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const chromeLib = 'C:/Users/Administrator/.dsh/skills/rebrand/scripts/lib/chrome.mjs';
const { launchChrome, openPage, findChrome } = await import(pathToFileURL(chromeLib).href);

const url = process.argv[2] || 'http://127.0.0.1:4498/';
const out = process.argv[3] || 'E:/workspace/chuangye/solana/mathlana/website/.reskin/preview/dark-home.png';
const width = 1440;
const height = 900;

const browser = await launchChrome({ executablePath: findChrome(), headless: true, proxy: null, width, height });
const page = await openPage(browser.cdp, { width, height });
try {
  await page.navigate(url, { timeoutMs: 45000, delayMs: 1500, width, height });
  await page.evaluate(`(() => { try { localStorage.setItem('theme', 'dark'); localStorage.setItem('qubitess-theme', 'dark'); } catch (e) {} return true; })()`);
  await page.navigate(url, { timeoutMs: 45000, delayMs: 2200, width, height });
  await page.evaluate(`(() => { document.documentElement.classList.add('dark'); document.body.classList.add('dark'); return true; })()`);
  await new Promise((r) => setTimeout(r, 600));
  const shot = await page.screenshot(path.resolve(out), { width, height, fullPage: true });
  console.log(JSON.stringify({ ok: true, screenshot: shot.path }));
} finally {
  await browser.close();
}
