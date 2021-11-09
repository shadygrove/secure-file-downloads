import { Component, OnInit } from "@angular/core";
import { saveAs } from 'file-saver';
import { Observable } from "rxjs";
import { Download } from "../../models/download.model";
import { FileDownloadService } from "../../services/file-download.service";

@Component({
  selector: "app-browser-ajax",
  templateUrl: "./browser-ajax.component.html",
  styleUrls: [],
})
export class FileDownloadBrowserAjaxComponent implements OnInit {
  enableAuth = true;
  downloadProgress$: Observable<Download>;
  smallFileDownloadUrl = "";
  largeFileDownloadUrl = "";

  constructor(private downloadSvc: FileDownloadService) {}

  ngOnInit(): void {
    this.smallFileDownloadUrl = this.downloadSvc.getSmallFileDownloadUrl();
    this.largeFileDownloadUrl = this.downloadSvc.getLargeFileDownloadUrl();
  }

  download() {
    this.downloadSvc.download().subscribe({
      next: (blob) => {
        const a = document.createElement("a");
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = "Small-File-Download.zip";
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
    });
  }

  downloadWithFileSaver() {
    this.downloadSvc.download().subscribe({
      next: (blob) => {
        saveAs(blob, "Don-Quixote-FileSaver.zip");
      },
    });
  }

  downloadWithProgress() {
    this.downloadProgress$ = this.downloadSvc.downloadWithProgress();
  }
}
