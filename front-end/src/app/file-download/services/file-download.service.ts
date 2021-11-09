import { HttpClient, HttpParams } from "@angular/common/http";
import { SecurityContext } from "@angular/compiler/src/core";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/auth";
import { AuthConfigService } from "src/app/auth/services/auth-config.service";
import * as streamSaver from "streamsaver";
import { DownloadTokenResponse } from "../models/download-token-response.model";
import { download } from "../models/download.model";


@Injectable({
  providedIn: "root",
})
export class FileDownloadService {
  private downloadUrl = "http://localhost:5000/api/Download";
  // private downloadInsecureUrl = "http://localhost:5000/api/Download/insecure";

  private smallFileId = "Don-Quixote";
  private largeFileId = "Angular-components";
  private veryLargeFileId = "big-file";
  private veryVeryLargeFileId = "really-big-file";

  private weatherSub$ = new BehaviorSubject<any>(null);
  weather$: Observable<any> = this.weatherSub$.asObservable();

  constructor(
    private http: HttpClient,
    private configService: AuthConfigService,
    private authSvc: AuthService
  ) {}

  getSmallFileDownloadUrl() {
    return this.getDownloadUrl(this.smallFileId);
  }

  getLargeFileDownloadUrl() {
    return this.getDownloadUrl(this.largeFileId);
  }

  setAuthEnabled(enabled: boolean = false) {
    this.configService.setAuthInterceptEnabled(enabled);
  }

  private getAuthEnabled() {
    return this.configService.getAuthInterceptEnabled();
  }

  testWeatherAPI(): Observable<any> {
    this.http.get("http://localhost:5000/WeatherForecast").subscribe({
      next: (w) => {
        this.weatherSub$.next(w);
      },
    });

    return this.weather$;
  }

  private getDownloadUrl(fileId: string) {
    return `${this.downloadUrl}/${fileId}`;
  }

  private getTokenUrl(fileId: string) {
    return `${this.downloadUrl}/${fileId}/token`;
  }

  getTokenDownloadUrl() {
    return `${this.downloadUrl}/${this.largeFileId}/token/download`;
  }

  download(): Observable<Blob> {
    var url = this.getDownloadUrl(this.smallFileId);

    return this.http.get(url, {
      responseType: "blob",
    });
  }

  downloadWithProgress() {
    const fileName = `${this.largeFileId}.zip`;
    const url = this.getDownloadUrl(this.veryVeryLargeFileId);

    return this.http
      .get(url, {
        responseType: "blob",
        reportProgress: true,
        observe: "events",
      })
      .pipe(download((blob) => saveAs(blob, fileName)));
  }

  downloadWithWorker() {
    const fileName = `${this.veryVeryLargeFileId}.zip`;
    const url = this.getDownloadUrl(this.veryVeryLargeFileId);

    // Setup stream saver
    const fileStream = streamSaver.createWriteStream(`${fileName}`);
    const authToken = this.authSvc.getAccessToken();

    const requestOptions: RequestInit = {
      method: "get",
    };

    if (this.getAuthEnabled()) {
      requestOptions.headers = new Headers({
        Authorization: "Bearer " + authToken,
        // "Content-Type": "application/x-www-form-urlencoded",
      });
    }

    fetch(url, requestOptions).then((res) => {
      const readableStream = res.body;

      // more optimized
      if (window.WritableStream && readableStream?.pipeTo) {
        return readableStream
          .pipeTo(fileStream)
          .then(() => {
            console.log("done writing");
          })
          .catch((e) => {
            console.log("ERROR: File Stream", e);
          });
      }

      const writer = fileStream.getWriter();
      const reader = res?.body?.getReader();

      const pump: any = () =>
        reader
          ?.read()
          .then((res) =>
            res.done ? writer.close() : writer.write(res.value).then(pump)
          );

      pump();

      return Promise.resolve();
    });
  }

  getDownloadToken(): Observable<string> {
    // First request a token
    return this.http
      .get<DownloadTokenResponse>(this.getTokenUrl(this.largeFileId))
      .pipe(map((res) => res.token));
  }

  downloadWithToken(token: string): Observable<any> {
    const fileId = this.largeFileId;
    const url = this.getTokenDownloadUrl();
    const fileName = `${fileId}.zip`;
    
    const params = new HttpParams().set("token", token);

    return this.http
      .get(url, {
        params,
        responseType: "blob",
        reportProgress: true,
        observe: "events",
      })
      .pipe(download((blob) => saveAs(blob, fileName)));;
  }
}