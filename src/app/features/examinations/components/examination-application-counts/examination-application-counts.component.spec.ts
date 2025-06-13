import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationApplicationCountsComponent } from './examination-application-counts.component';

describe('ExaminationApplicationCountsComponent', () => {
  let component: ExaminationApplicationCountsComponent;
  let fixture: ComponentFixture<ExaminationApplicationCountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationApplicationCountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminationApplicationCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
