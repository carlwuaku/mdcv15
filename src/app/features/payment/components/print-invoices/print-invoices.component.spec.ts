import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintInvoicesComponent } from './print-invoices.component';

describe('PrintInvoicesComponent', () => {
  let component: PrintInvoicesComponent;
  let fixture: ComponentFixture<PrintInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintInvoicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
