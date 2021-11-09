import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListsComponent } from "./lists/lists.component";
import { AppMaterialModule } from "../material-module";
import { ExamplesRoutingModule } from "./examples-routing.module";
import { NotificationsComponent } from "./notifications/notifications.component";
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DualListExampleComponent } from "./dual-list-example/dual-list-example.component";

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    ExamplesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ListsComponent,
    NotificationsComponent,
    DualListExampleComponent
  ],
  exports: []
})
export class ExamplesModule {}
