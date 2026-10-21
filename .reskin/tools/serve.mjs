// Deterministic preview server for the reskin gates.
//
// The site reads two live feeds. Prices move between the baseline and the
// current capture, so /api/market is pinned to the app's own built-in snapshot
// (empty token map => data/tokens.js) and /api/quantum/status is served from a
// cached live response. Everything else is proxied to the real origin, and the
// SPA falls back to index.html for client routes.
//
//   node .reskin/tools/serve.mjs <dist-dir> <port>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || 4499);
const quantumPath = path.resolve('.reskin/quantum-cache.json');
const quantum = fs.existsSync(quantumPath) ? fs.readFileSync(quantumPath, 'utf8') : '{"running":0,"machines":[]}';
const origin = 'https://mathlana.si';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname === '/api/market') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ fetchedAt: new Date().toISOString(), tokens: {} }));
    return;
  }
  if (url.pathname === '/api/quantum/status') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    res.end(quantum);
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    try {
      const upstream = await fetch(origin + url.pathname + url.search, {
        headers: { accept: req.headers.accept || '*/*' },
      });
      res.writeHead(upstream.status, {
        'content-type': upstream.headers.get('content-type') || 'application/octet-stream',
        'cache-control': 'no-store',
      });
      res.end(Buffer.from(await upstream.arrayBuffer()));
    } catch {
      res.writeHead(502);
      res.end('upstream unavailable');
    }
    return;
  }
  let file = path.join(root, decodeURIComponent(url.pathname));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'content-type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, '127.0.0.1', () => console.log(`deterministic preview on http://127.0.0.1:${port}/ from ${root}`));
