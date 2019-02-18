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
  updating = false;
  showProgress = false;
  max = 100;
  progress:number = null;

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
      this.progress = progressDescriptor.percent;

      if (this.progress > 0) {
        this.showProgress = true;
      } else if (this.progress >= 100) {
        this.showProgress = false;
      }
    });
    this.es.ipcRenderer.on('update-downloaded', () => {
      this.expectedVersion = null;
      this.updating = false;
      this.ready = true;
    });
  }

  download() {
    this.es.ipcRenderer.send('start-download');
    this.updating = true;
    this.expectedVersion = null;
  }

  update() {
    this.es.ipcRenderer.send('start-update');
  }

  cancel() {
    this.expectedVersion = null;
  }

  isActive(): boolean {
    return !!this.expectedVersion || this.updating || this.showProgress || this.ready;
  }
}
