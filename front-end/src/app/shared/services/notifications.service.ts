import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  SimpleSnackBar
} from "@angular/material/snack-bar";

import { NotificationType } from "../models/notification-type.enum";
import { LoggerService } from "./logger.service";

@Injectable({
  providedIn: "root"
})
export class NotificationsService {
  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private logger: LoggerService
  ) {}

  /**
   * A short hand, less error-prone version for a common notification with one less argument to pass
   *
   * @param message The translated text to display
   * @param actionName The translated text to show as the action button label
   */
  public showSnackBarInfo(
    message: string,
    actionName: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.showSnackBar(message, actionName, NotificationType.info);
  }

  /**
   * A short hand, less error-prone version for a common notification with one less argument to pass
   *
   * @param message The translated text to display
   * @param actionName The translated text to show as the action button label
   */
  public showSnackBarWarn(
    message: string,
    actionName: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.showSnackBar(message, actionName, NotificationType.warn);
  }

  /**
   * A short hand, less error-prone version for a common notification with one less argument to pass
   *
   * @param message The translated text to display
   * @param actionName The translated text to show as the action button label
   */
  public showSnackBarSuccess(
    message: string,
    actionName: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.showSnackBar(message, actionName, NotificationType.success);
  }

  public showSnackBar(
    message: string,
    actionName: string,
    notificationType: NotificationType
  ): MatSnackBarRef<SimpleSnackBar> {
    const config: MatSnackBarConfig = {};
    config.verticalPosition = "bottom";
    config.horizontalPosition = "right";
    config.duration = 60000;

    let snackBarPanelClass;
    if (notificationType) {
      snackBarPanelClass = `tc-snackbar-${notificationType}`;
    }

    config.panelClass = ["tc-snackbar-panel", snackBarPanelClass || ""];

    this.logger.log(`Snackbar launched: ${notificationType} `, config);

    return this.snackbar.open(message, actionName, config);
  }
}
