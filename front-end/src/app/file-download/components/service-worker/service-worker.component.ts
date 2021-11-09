import { Component, OnInit } from '@angular/core';
import { FileDownloadService } from '../../services/file-download.service';

@Component({
  selector: "app-service-worker",
  templateUrl: "./service-worker.component.html",
  styleUrls: ["./service-worker.component.scss"],
})
export class FileDownloadServiceWorkerComponent implements OnInit {
  constructor(private downloadSvc: FileDownloadService) {}

  ngOnInit(): void {}

  downloadViaWorker() {
    this.downloadSvc.downloadWithWorker();
  }
}
