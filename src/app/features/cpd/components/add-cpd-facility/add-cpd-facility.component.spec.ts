import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCpdFacilityComponent } from './add-cpd-facility.component';

describe('AddCpdFacilityComponent', () => {
  let component: AddCpdFacilityComponent;
  let fixture: ComponentFixture<AddCpdFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCpdFacilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCpdFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
