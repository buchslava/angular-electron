import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  constructor(private es: ElectronService) {
    ipcRenderer.on('update-available', (event, versionDescriptor) => {
      console.log(versionDescriptor.version);
    });
    ipcRenderer.on('update-error', (event, err) => {
      console.log(err);
    });
    ipcRenderer.on('download-progress', (event, progressDescriptor) => {
      console.log(progressDescriptor.percent);
    });
    ipcRenderer.on('update-downloaded', () => {
      console.log('ready');
    });
  }

  ngOnInit() {
  }
}
