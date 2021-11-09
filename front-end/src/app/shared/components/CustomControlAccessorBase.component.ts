import { Component, Input } from "@angular/core";
import { ControlContainer, ControlValueAccessor, FormControl } from "@angular/forms";
import { Subject } from "rxjs";


@Component({
  template: ''
})
export abstract class CustomControlAccessorBase<T> implements ControlValueAccessor {
  abstract value: T;
  
  // START: FormControl support
  @Input()
  formControl: FormControl;

  @Input()
  formControlName: string;

  get control() {
    return (
      this.formControl ||
      this.controlContainer?.control?.get(this.formControlName)
    );
  }

  protected onTouched = () => {};
  protected onChange = (_: T) => {};

  // Enable implementation to handle reset scenario
  protected writeEvent$ = new Subject<T>();
  
  // END: FormControl support

  constructor(private controlContainer: ControlContainer) {}

 /* ControlValueAccessor implementation */
  public writeValue(obj: T): void {
    this.value = obj;

    this.writeEvent$.next();
  }

  public registerOnChange(fn: (val: T) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  /* ControlValueAccessor implementation END */
}

