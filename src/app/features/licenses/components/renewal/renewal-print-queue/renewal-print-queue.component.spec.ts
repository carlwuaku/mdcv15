import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalPrintQueueComponent } from './renewal-print-queue.component';

describe('RenewalPrintQueueComponent', () => {
  let component: RenewalPrintQueueComponent;
  let fixture: ComponentFixture<RenewalPrintQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalPrintQueueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewalPrintQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
