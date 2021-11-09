import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BrowserAjaxComponent } from "./browser-ajax.component";

describe("BrowserAjaxComponent", () => {
  let component: BrowserAjaxComponent;
  let fixture: ComponentFixture<BrowserAjaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrowserAjaxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserAjaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
