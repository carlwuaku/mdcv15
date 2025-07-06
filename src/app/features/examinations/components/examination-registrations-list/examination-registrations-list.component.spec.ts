import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationRegistrationsListComponent } from './examination-registrations-list.component';

describe('ExaminationRegistrationsListComponent', () => {
  let component: ExaminationRegistrationsListComponent;
  let fixture: ComponentFixture<ExaminationRegistrationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationRegistrationsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminationRegistrationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
