import { Component, OnInit } from "@angular/core";
import { FileDownloadService } from "../services/file-download.service";

@Component({
  selector: "app-filedownload-home",
  templateUrl: "./home.component.html",
})
export class FileDownloadHomeComponent implements OnInit {
  isChecked = true;
  enableAuth = true;

  constructor(private fileDownloadSvc: FileDownloadService) {}

  ngOnInit(): void {
    this.fileDownloadSvc.setAuthEnabled(this.enableAuth);
  }

  toggleChanged($event: any) {
    console.log($event);
    this.fileDownloadSvc.setAuthEnabled(this.enableAuth);
  }
}
