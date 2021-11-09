import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FileDownloadBrowserAjaxComponent } from "./components/browser-ajax/browser-ajax.component";
import { FileDownloadSingleUseTokenComponent } from "./components/single-use-token/single-use-token.component";
import { FileDownloadHomeComponent } from "./home/home.component";
import { FileDownloadServiceWorkerComponent } from "./components/service-worker/service-worker.component";
import { FileDownloadNotesComponent } from "./home/notes/notes.component";
import { MarkdownModule } from "ngx-markdown";
import { AppMaterialModule } from "../material-module";
import { RouterModule } from "@angular/router";
import { FileDownloadInfoComponent } from "./home/info/info.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    FileDownloadBrowserAjaxComponent,
    FileDownloadSingleUseTokenComponent,
    FileDownloadHomeComponent,
    FileDownloadServiceWorkerComponent,
    FileDownloadNotesComponent,
    FileDownloadInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppMaterialModule,
    MarkdownModule.forChild(),
    RouterModule.forChild([]),
  ],
})
export class FileDownloadModule {}
