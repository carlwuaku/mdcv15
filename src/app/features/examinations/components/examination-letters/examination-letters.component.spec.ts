import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationLettersComponent } from './examination-letters.component';

describe('ExaminationLettersComponent', () => {
  let component: ExaminationLettersComponent;
  let fixture: ComponentFixture<ExaminationLettersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExaminationLettersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExaminationLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
