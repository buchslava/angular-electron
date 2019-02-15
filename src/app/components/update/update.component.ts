import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class UpdateComponent implements OnInit {
  expectedVersion: string;
  ready = false;
  showProgress = false;
  max = 100;
  progress = 0;

  constructor(private es: ElectronService) {
  }

  ngOnInit() {
    this.es.ipcRenderer.on('update-available', (e, versionDescriptor) => {
      this.expectedVersion = versionDescriptor.version;
    });
    this.es.ipcRenderer.on('update-error', (e, err) => {
      console.log(err);
    });
    this.es.ipcRenderer.on('download-progress', (e, progressDescriptor) => {
      this.progress = progressDescriptor.percent
      console.log(this.progress);
    });
    this.es.ipcRenderer.on('update-downloaded', () => {
      this.expectedVersion = null;
      this.ready = true;
    });
  }

  download() {
    this.es.ipcRenderer.send('start-download');
  }

  update() {
    this.es.ipcRenderer.send('start-update');
    this.expectedVersion = null;
    this.showProgress = true;
  }

  cancel() {
    this.expectedVersion = null;
  }

  isActive(): boolean {
    return !!this.expectedVersion || this.showProgress || this.ready;
  }
}
