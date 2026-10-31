// Builds the GitHub Pages artifact: only the files the app needs to run.
import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootRelative = entry => path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP_FILES = ['index.html', 'manifest.webmanifest', 'sw.js', 'src', 'assets', 'examples'];

export async function buildSite(destination = path.join(rootRelative(), 'artifacts', 'site')) {
  const siteDirectory = path.resolve(destination);
  await rm(siteDirectory, { recursive: true, force: true });
  await mkdir(siteDirectory, { recursive: true });
  for (const entry of APP_FILES) {
    await cp(path.resolve(rootRelative(), entry), path.join(siteDirectory, entry), { recursive: true });
  }
  return siteDirectory;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const siteDirectory = await buildSite();
  console.log('Site artefact built at', siteDirectory);
}
