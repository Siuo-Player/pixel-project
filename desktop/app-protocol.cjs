const path = require('node:path');

const APP_SCHEME = 'pixel-project:';
const APP_HOST = 'bundle';

function resolveAppAssetPath(appRoot, requestUrl) {
  if (typeof appRoot !== 'string' || !appRoot || typeof requestUrl !== 'string') return null;

  let url;
  try {
    url = new URL(requestUrl);
  } catch {
    return null;
  }

  if (url.protocol !== APP_SCHEME || url.hostname !== APP_HOST) return null;

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return null;
  }
  if (pathname.includes('\0')) return null;

  const relativePath = pathname === '/' || pathname === ''
    ? 'index.html'
    : pathname.replace(/^\/+/, '');
  const root = path.resolve(appRoot);
  const target = path.resolve(root, relativePath);
  const relative = path.relative(root, target);

  if (
    relative === '..' ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) return null;

  return target;
}

module.exports = { resolveAppAssetPath };
