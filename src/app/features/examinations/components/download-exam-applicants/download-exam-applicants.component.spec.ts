import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadExamApplicantsComponent } from './download-exam-applicants.component';

describe('DownloadExamApplicantsComponent', () => {
  let component: DownloadExamApplicantsComponent;
  let fixture: ComponentFixture<DownloadExamApplicantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadExamApplicantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadExamApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
