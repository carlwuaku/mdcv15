import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingInstitutionDetailsComponent } from './training-institution-details.component';

describe('TrainingInstitutionDetailsComponent', () => {
  let component: TrainingInstitutionDetailsComponent;
  let fixture: ComponentFixture<TrainingInstitutionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingInstitutionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingInstitutionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
