import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdditionalQualificationComponent } from './edit-additional-qualification.component';

describe('EditAdditionalQualificationComponent', () => {
  let component: EditAdditionalQualificationComponent;
  let fixture: ComponentFixture<EditAdditionalQualificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAdditionalQualificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdditionalQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
