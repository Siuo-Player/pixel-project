import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { createStaticServer } from '../../scripts/serve.mjs';

async function getAvailablePort() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  await new Promise(resolve => server.close(resolve));
  return port;
}

test('static server serves the editor and its modules with correct content types', async t => {
  const port = await getAvailablePort();
  const server = createStaticServer();
  await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));

  const page = await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /text\/html/);
  const html = await page.text();
  assert.match(html, /source-canvas/);
  assert.match(html, /output-panels/);

  const script = await fetch(`http://127.0.0.1:${port}/src/main.js`);
  assert.equal(script.status, 200);
  assert.match(script.headers.get('content-type'), /javascript/);
  assert.match(await script.text(), /createProject/);
});

test('static server does not expose paths outside the application root', async t => {
  const port = await getAvailablePort();
  const server = createStaticServer();
  await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const response = await fetch(`http://127.0.0.1:${port}/%2e%2e/%2e%2e/etc/passwd`);
  assert.ok([403, 404].includes(response.status));
});
