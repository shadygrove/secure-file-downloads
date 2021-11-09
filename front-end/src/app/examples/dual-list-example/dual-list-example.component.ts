import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { LoggerService } from "../../shared";
import { SelectItem } from "../../shared/models/select-item.model";

@Component({
  selector: "app-dual-list-example",
  templateUrl: "./dual-list-example.component.html",
  styleUrls: ["./dual-list-example.component.css"],
})
export class DualListExampleComponent implements OnInit {
  @ViewChild(MatSelect)
  matSelect: MatSelect;

  basicMultiSelectOptions: SelectItem[] = [
    {
      key: "meatloaf",
      text: "Meat Loaf",
      value: 100,
      selected: false,
    },
    {
      key: "boots",
      text: "Boots",
      value: 101,
      selected: false,
      disabled: true,
    },
    {
      key: "clogs",
      text: "Clogs",
      value: 102,
      selected: true,
    },
  ];
  basicMultiSelectSelected: SelectItem[] = [];

  dualListOptions: SelectItem[] = [
    {
      key: "meatloaf",
      text: "Meat Loaf",
      value: 100,
      selected: false,
    },
    {
      key: "boots",
      text: "Boots",
      value: 101,
      selected: false,
      disabled: true,
    },
    {
      key: "clogs",
      text: "Clogs",
      value: 102,
      selected: true,
    },
    {
      key: "loafers",
      text: "Loafers",
      value: 103,
      selected: false,
    },
    {
      key: "moccasins",
      text: "Moccasins",
      value: 104,
      selected: true,
    },
  ];
  dualListOptionsSelected: SelectItem[] = [];

  nameValue: string = "Billy Bob";

  myFormGroup: FormGroup;
  get name() {
    return this.myFormGroup.get("name");
  }

  get preferredShoeTypesCtrl() {
    return this.myFormGroup.get("preferredShoeTypes");
  }

  constructor(private logger: LoggerService, private fb: FormBuilder) {}

  ngOnInit() {
    this.dualListOptionsSelected = this.dualListOptions.filter(
      (o) => o.selected
    );

    this.myFormGroup = this.fb.group({
      name: this.fb.control(this.nameValue, {
        validators: [Validators.required],
      }),
      multiSelect: this.fb.control(this.basicMultiSelectSelected),
      preferredShoeTypes: this.fb.control(this.dualListOptionsSelected, {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(3),
        ],
      }),
    });

    this.myFormGroup.valueChanges.subscribe({
      next: () => {
        this.logger.log("myFormGroup value changed");
        this.logger.log("myFormGroup shoeType", this.dualListOptionsSelected);
      },
    });
  }

  resetForm() {
    this.myFormGroup.reset({
      name: "Billy Bob",
      preferredShoeTypes: this.dualListOptions.filter((o) => o.selected),
    });
  }
}
