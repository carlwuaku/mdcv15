import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadableCkeditorInputComponent } from './uploadable-ckeditor-input.component';

describe('UploadableCkeditorInputComponent', () => {
  let component: UploadableCkeditorInputComponent;
  let fixture: ComponentFixture<UploadableCkeditorInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadableCkeditorInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadableCkeditorInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
