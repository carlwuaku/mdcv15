import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdAttendanceComponent } from './cpd-attendance.component';

describe('CpdAttendanceComponent', () => {
  let component: CpdAttendanceComponent;
  let fixture: ComponentFixture<CpdAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpdAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
