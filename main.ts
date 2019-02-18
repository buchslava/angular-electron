import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { app, BrowserWindow, ipcMain as ipc, remote } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as log from 'electron-log';

autoUpdater.logger = log as any;
(autoUpdater.logger as any).transports.file.level = 'info';
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');
const nonAsarAppPath = app.getAppPath().replace(/app\.asar/, '');
const userDataPath = (app || remote.app).getPath('userData');
const settingsPath = path.resolve(userDataPath, 'settings-ae.json');

let win;
let settings;

function getSettings() {
  try {
    return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  } catch (e) {
    return {
      x: 0,
      y: 0,
      width: 800,
      height: 600
    };
  }
}

function writeSettings() {
  const {x, y, width, height} = win.getBounds();
  settings.x = x;
  settings.y = y;
  settings.width = width;
  settings.height = height;
  fs.writeFileSync(settingsPath, JSON.stringify(settings));
}

function createWindow() {
  settings = getSettings();
  win = new BrowserWindow({
    x: settings.x,
    y: settings.y,
    width: settings.width,
    height: settings.height,
    title: `Electron app example v.${app.getVersion()}`
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

  win.webContents.once('did-finish-load', () => {
    autoUpdater.checkForUpdates();
  });

  win.on('closed', () => {
    win = null;
  });

  win.on('close', () => {
    writeSettings();
  });

  ipc.on('start-download', () => {
    autoUpdater.downloadUpdate();
  });

  ipc.on('start-update', () => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('update-available', (ev) => {
    win.webContents.send('update-available', ev);
  });

  autoUpdater.on('error', (err) => {
    win.webContents.send('update-error', err);
  });

  autoUpdater.on('download-progress', (ev) => {
    win.webContents.send('download-progress', ev);
  });

  autoUpdater.on('update-downloaded', (ev) => {
    win.webContents.send('update-downloaded', ev);
  });
}

app.on('ready', () => {
  createWindow();
});

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
