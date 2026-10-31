// Desktop wrapper: serves the same web app over a confined local protocol.
// Avoid file:// so renderer content cannot read arbitrary local files.
const { app, BrowserWindow, net, protocol } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { resolveAppAssetPath } = require('./app-protocol.cjs');

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'pixel-project',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true
    }
  }
]);

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 480,
    autoHideMenuBar: true,
    title: 'Pixel Project',
    backgroundColor: '#111318',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  window.loadURL('pixel-project://bundle/');
}

app.whenReady().then(() => {
  protocol.handle('pixel-project', request => {
    const filePath = resolveAppAssetPath(app.getAppPath(), request.url);
    if (!filePath) {
      return new Response('Not found', {
        status: 404,
        headers: { 'content-type': 'text/plain; charset=utf-8' }
      });
    }
    return net.fetch(pathToFileURL(filePath).toString());
  });

  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
