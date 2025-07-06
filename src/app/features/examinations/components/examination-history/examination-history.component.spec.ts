import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationHistoryComponent } from './examination-history.component';

describe('ExaminationHistoryComponent', () => {
  let component: ExaminationHistoryComponent;
  let fixture: ComponentFixture<ExaminationHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
