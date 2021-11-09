import { Component, Input, OnInit } from "@angular/core";
import { NotificationsService } from "../../shared/";

@Component({
  selector: "app-snackbar",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"]
})
export class NotificationsComponent implements OnInit {
  constructor(private notify: NotificationsService) {}

  ngOnInit() {}

  showBasic() {
    this.notify.showSnackBarInfo("Basic!", "OK");
  }

  showWarn() {
    this.notify.showSnackBarWarn("Warning!", "OK");
  }

  showSuccess() {
    this.notify.showSnackBarSuccess("Success!", "OK");
  }
}
