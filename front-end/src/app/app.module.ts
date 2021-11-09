import { NgModule } from "@angular/core";

// import { ListBasicExample } from "./list-basic/list-basic.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AppMaterialModule } from "./material-module";
import { MatNativeDateModule } from "@angular/material/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

import { AppComponent } from "./app/app.component";
import { AppRoutingModule } from "./app-routing.module";
import { HomeComponent } from "./app/home.component";
import { ExamplesModule } from "./examples/examples.module";
import { SharedModule } from "./shared/shared.module";
import { FileDownloadModule } from "./file-download/file-download.module";
import { MarkdownModule } from "ngx-markdown";
import { AuthModule } from "./auth";

// Default MatFormField appearance to 'fill' as that is the new recommended approach and the
// `legacy` and `standard` appearances are scheduled for deprecation in version 10.
// This makes the examples that use MatFormField render the same in StackBlitz as on the docs site.
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    SharedModule,
    AppRoutingModule,
    ExamplesModule,
    FileDownloadModule,
    MarkdownModule.forRoot({ loader: HttpClient}),
    AuthModule.forRoot(),
  ],
  entryComponents: [AppComponent],
  declarations: [AppComponent, HomeComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "fill" },
    },
  ],
})
export class AppModule {}
