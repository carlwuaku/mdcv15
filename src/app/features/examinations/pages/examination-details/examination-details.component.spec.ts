import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationDetailsComponent } from './examination-details.component';

describe('ExaminationDetailsComponent', () => {
  let component: ExaminationDetailsComponent;
  let fixture: ComponentFixture<ExaminationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
