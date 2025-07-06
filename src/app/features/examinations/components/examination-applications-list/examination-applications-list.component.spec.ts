import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationApplicationsListComponent } from './examination-applications-list.component';

describe('ExaminationApplicationsListComponent', () => {
  let component: ExaminationApplicationsListComponent;
  let fixture: ComponentFixture<ExaminationApplicationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationApplicationsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminationApplicationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
