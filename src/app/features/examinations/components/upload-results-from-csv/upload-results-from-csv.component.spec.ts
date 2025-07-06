import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadResultsFromCsvComponent } from './upload-results-from-csv.component';

describe('UploadResultsFromCsvComponent', () => {
  let component: UploadResultsFromCsvComponent;
  let fixture: ComponentFixture<UploadResultsFromCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadResultsFromCsvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadResultsFromCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
