import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');
const nonAsarAppPath = app.getAppPath().replace(/app\.asar/, '');

let win;

function createWindow() {
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 800, // size.width,
    height: 600 // size.height
  });

  win.appPath = nonAsarAppPath;

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

try {
  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
}
