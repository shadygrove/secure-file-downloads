import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../auth";
import { LoggerService } from "../shared";
import { LogInfo } from "../shared/models/log-info.model";

@Component({
  selector: "app-component",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  logs: LogInfo[] = [];
  userName = "";
  isLoggedIn = false;

  constructor(
    private logger: LoggerService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.runInitialLoginSequence().subscribe();

    this.router.errorHandler = (err) => {
      console.log("ROUTER ERROR", err);
      this.router.navigate(["error"]);
    };

    this.logger.logs$.subscribe({
      next: (log) => this.logs.unshift(log),
    });

    this.authService.user$().subscribe({
      next: (u) => {
        this.userName = u.fullName;
      },
    });

    this.authService.isAuthenticated$().subscribe(hasAuth => this.isLoggedIn = hasAuth);
  }

  logout() {
    this.authService.logout();
  }
}
