import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDownloadSingleUseTokenComponent } from "./single-use-token.component";

describe('SingleUseTokenComponent', () => {
  let component: FileDownloadSingleUseTokenComponent;
  let fixture: ComponentFixture<FileDownloadSingleUseTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileDownloadSingleUseTokenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDownloadSingleUseTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
