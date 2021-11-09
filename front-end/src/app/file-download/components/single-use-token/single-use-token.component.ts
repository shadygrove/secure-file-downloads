import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Download } from '../../models/download.model';
import { FileDownloadService } from '../../services/file-download.service';

@Component({
  selector: "app-single-use-token",
  templateUrl: "./single-use-token.component.html",
  styleUrls: [],
})
export class FileDownloadSingleUseTokenComponent implements OnInit {
  tokenDownloadUrl = "";
  downloadToken: string = "";
  error = null;
  downloadProgress$: Observable<Download>;

  constructor(private downloadSvc: FileDownloadService) {}

  ngOnInit(): void {
    this.tokenDownloadUrl = this.downloadSvc.getTokenDownloadUrl();
  }

  getToken() {
    this.error = null;

    this.downloadSvc.getDownloadToken().subscribe({
      next: (token) => {
        this.downloadToken = token;
        this.tokenDownloadUrl = this.tokenDownloadUrl + '?token=' + token;
      },
      error: (err) => {
        this.error = err;
      },
    });
  }

  downloadWithToken() {
    this.downloadProgress$ = this.downloadSvc.downloadWithToken(
      this.downloadToken
    );
  }
}
