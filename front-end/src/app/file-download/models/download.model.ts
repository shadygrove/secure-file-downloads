import { HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { scan } from "rxjs/operators";

export interface Download {
  state: "PENDING" | "IN_PROGRESS" | "DONE";
  progress: number;
  content: Blob | null;
}


function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(
  event: HttpEvent<unknown>
): event is HttpProgressEvent {
  return (
    event.type === HttpEventType.DownloadProgress ||
    event.type === HttpEventType.UploadProgress
  );
}

export function download(saver?: (b: Blob) => void): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
  return (source: Observable<HttpEvent<Blob>>) =>
    source.pipe(
      scan(
        (previous: Download, event: HttpEvent<Blob>): Download => {
          if (isHttpProgressEvent(event)) {
            return {
              progress: event.total
                ? Math.round((100 * event.loaded) / event.total)
                : previous.progress,
              state: "IN_PROGRESS",
              content: null,
            };
          }
          if (isHttpResponse(event)) {
            if (saver && event.body) {
              saver(event.body);
            }
            return {
              progress: 100,
              state: "DONE",
              content: event.body,
            };
          }
          return previous;
        },
        { state: "PENDING", progress: 0, content: null }
      )
    );
}
