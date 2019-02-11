import * as path from 'path';
import * as url from 'url';
import { app, BrowserWindow, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as log from 'electron-log';

autoUpdater.logger = log as any;
(autoUpdater.logger as any).transports.file.level = 'info';
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');
const nonAsarAppPath = app.getAppPath().replace(/app\.asar/, '');

let win;

function createWindow() {
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: 800, // size.width,
    height: 600, // size.height
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

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdates();
  // autoUpdater.checkForUpdatesAndNotify();
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

autoUpdater.on('update-available', (ev) => {
  console.log(222, ev.version);
  win.webContents.send('update-available', ev);
  setTimeout(() => {
    autoUpdater.downloadUpdate();
  }, 5000);
})
autoUpdater.on('error', (err) => {
  console.log(333, err);
  win.webContents.send('update-error', err);
})
autoUpdater.on('download-progress', (ev) => {
  console.log(111, ev.percent);
  win.webContents.send('download-progress', ev);
})

autoUpdater.on('update-downloaded', (ev) => {
  // win.webContents.send('update-downloaded', ev);
  setTimeout(function () {
    autoUpdater.quitAndInstall();
  }, 5000);
})
