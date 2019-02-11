import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  addressBook: [];

  constructor(private es: ElectronService) {
  }

  ngOnInit() {
    const dataPath = this.es.path.resolve(this.es.appPath, 'data', 'contacts.json');

    this.es.fsExtra.readJson(dataPath).then(data => {
      this.addressBook = data;
    }).catch(err => {
      console.log(err);
    });
  }
}
