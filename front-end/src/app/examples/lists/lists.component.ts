import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { LoggerService } from "../../shared";
import { SelectItem } from "../../shared/models/select-item.model";

@Component({
  selector: "app-lists",
  templateUrl: "./lists.component.html",
  styleUrls: ["./lists.component.css"]
})
export class ListsComponent implements OnInit {
  view = "selection";

  typesOfShoes: string[] = [
    "Boots",
    "Clogs",
    "Loafers",
    "Moccasins",
    "Sneakers"
  ];

  constructor(
    private route: ActivatedRoute,
    private logger: LoggerService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // Determine page view/mode
    this.route.paramMap.subscribe(p => {
      this.view = p.get("type") || "";
    });

    this.logger.log("List Route Params", this.route.snapshot.params);
    this.logger.log("List View: ", this.view);
  }
}
