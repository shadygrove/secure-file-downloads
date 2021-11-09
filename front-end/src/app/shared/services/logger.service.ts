import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LogInfo } from "../models/log-info.model";

@Injectable({
  providedIn: "root"
})
export class LoggerService {
  logs$: BehaviorSubject<LogInfo> = new BehaviorSubject<LogInfo>({
    type: "debug",
    message: "LogService: initialized",
    data: ""
  });

  constructor() {
    this.logs$.subscribe({
      next: logInfo => {
        console.log(
          `${logInfo.type.toUpperCase()}: message: ${logInfo.message}`,
          logInfo.data
        );
      }
    });
  }

  public debug(message: string, object?: any) {
    this.logs$.next({
      type: "debug",
      message: message,
      data: object
    });
  }

  public error(message: string, object?: any) {
    this.logs$.next({
      type: "error",
      message: message,
      data: object
    });
  }

  public log(message: string, object?: any) {
    this.logs$.next({
      type: "log",
      message: message,
      data: object
    });
  }

  public info(message: string, object?: any) {
    this.logs$.next({
      type: "info",
      message: message,
      data: object
    });
  }
}
