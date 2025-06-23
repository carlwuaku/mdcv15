import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetResultsDialogComponent } from './set-results-dialog.component';

describe('SetResultsDialogComponent', () => {
  let component: SetResultsDialogComponent;
  let fixture: ComponentFixture<SetResultsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetResultsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
