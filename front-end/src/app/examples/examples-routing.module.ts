import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DualListExampleComponent } from "./dual-list-example/dual-list-example.component";
import { ListsComponent } from "./lists/lists.component";
import { NotificationsComponent } from "./notifications/notifications.component";

const routes: Routes = [
  { path: "dual-list-example", component: DualListExampleComponent },
  {
    path: "notifications",
    component: NotificationsComponent
  },
  { path: "lists/:type", component: ListsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamplesRoutingModule {}
