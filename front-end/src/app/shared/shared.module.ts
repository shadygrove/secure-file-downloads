import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DualListComponent } from "./components/dual-list/dual-list.component";
import { AppMaterialModule } from "../material-module";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [DualListComponent],
  exports: [DualListComponent]
})
export class SharedModule {}
