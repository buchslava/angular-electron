import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';

@Injectable()
export class ElectronService {

  appPath: string;
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  path: typeof path;
  fs: typeof fs;
  fsExtra: typeof fsExtra;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      const currentWindow: any = this.remote.getCurrentWindow();
      this.appPath = currentWindow.appPath;

      this.childProcess = window.require('child_process');
      this.path = window.require('path');
      this.fs = window.require('fs');
      this.fsExtra = window.require('fs-extra');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
