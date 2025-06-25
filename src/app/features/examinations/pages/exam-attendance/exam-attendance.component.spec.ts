import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAttendanceComponent } from './exam-attendance.component';

describe('ExamAttendanceComponent', () => {
  let component: ExamAttendanceComponent;
  let fixture: ComponentFixture<ExamAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
