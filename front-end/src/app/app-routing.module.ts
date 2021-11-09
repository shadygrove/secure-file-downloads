import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRoutingErrorComponent } from "./app-error.component";
import { HomeComponent } from "./app/home.component";
import { AuthHandlerComponent } from "./auth/components/auth-handler/auth-handler.component";
import { AuthWithForcedLoginGuard } from "./auth/guards/auth-with-forced-login.guard";

import { FileDownloadBrowserAjaxComponent } from "./file-download/components/browser-ajax/browser-ajax.component";
import { FileDownloadInfoComponent } from "./file-download/home/info/info.component";
import { FileDownloadServiceWorkerComponent } from "./file-download/components/service-worker/service-worker.component";
import { FileDownloadHomeComponent } from "./file-download/home/home.component";
import { FileDownloadSingleUseTokenComponent } from "./file-download/components/single-use-token/single-use-token.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  { path: "auth-handler", component: AuthHandlerComponent },
  {
    path: "error",
    component: AppRoutingErrorComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "file-download",
    component: FileDownloadHomeComponent,
    canActivate: [AuthWithForcedLoginGuard],
    children: [
      {
        path: "",
        redirectTo: "info",
        pathMatch: "full",
      },
      {
        path: "info",
        component: FileDownloadInfoComponent,
      },
      {
        path: "browser",
        component: FileDownloadBrowserAjaxComponent,
      },
      {
        path: "service-worker",
        component: FileDownloadServiceWorkerComponent,
      },
      {
        path: "server-token",
        component: FileDownloadSingleUseTokenComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
