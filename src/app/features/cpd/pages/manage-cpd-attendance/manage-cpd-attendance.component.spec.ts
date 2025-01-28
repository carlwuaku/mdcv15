import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCpdAttendanceComponent } from './manage-cpd-attendance.component';

describe('ManageCpdAttendanceComponent', () => {
  let component: ManageCpdAttendanceComponent;
  let fixture: ComponentFixture<ManageCpdAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCpdAttendanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCpdAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
