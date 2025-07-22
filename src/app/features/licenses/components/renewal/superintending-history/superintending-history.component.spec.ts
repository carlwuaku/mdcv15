import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperintendingHistoryComponent } from './superintending-history.component';

describe('SuperintendingHistoryComponent', () => {
  let component: SuperintendingHistoryComponent;
  let fixture: ComponentFixture<SuperintendingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperintendingHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperintendingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
