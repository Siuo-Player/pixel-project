import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pixelproj': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

export function createStaticServer({ directory = root } = {}) {
  const safeRoot = path.resolve(directory);
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://localhost');
      let pathname = decodeURIComponent(url.pathname);
      if (pathname === '/') pathname = '/index.html';
      const target = path.resolve(safeRoot, `.${pathname}`);
      if (target !== safeRoot && !target.startsWith(`${safeRoot}${path.sep}`)) {
        response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
        response.end('Forbidden');
        return;
      }
      const info = await stat(target);
      if (!info.isFile()) throw new Error('Not a file');
      const body = await readFile(target);
      response.writeHead(200, {
        'content-type': TYPES[path.extname(target)] ?? 'application/octet-stream',
        'x-content-type-options': 'nosniff',
        'cache-control': 'no-store'
      });
      response.end(body);
    } catch {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4173);
  const server = createStaticServer();
  server.listen(port, '0.0.0.0', () => process.stdout.write(`Pixel Project running at http://localhost:${port}\n`));
}
