import { Component, OnInit } from '@angular/core';
import { FileDownloadService } from '../../services/file-download.service';

@Component({
  selector: "app-filedownload-info",
  templateUrl: "./info.component.html",
})
export class FileDownloadInfoComponent implements OnInit {

  weather = null;

  constructor(private downloadSvc: FileDownloadService) {}

  ngOnInit(): void {
    // request data; html view listens to observable
    // this.downloadSvc.testWeatherAPI();
  }

  testAPI() {
    this.downloadSvc.testWeatherAPI()
      .subscribe({
        next: weather => {
          this.weather = weather;
        }
      });
  }
}
