import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentUploadsComponent } from './payment-uploads.component';

describe('PaymentUploadsComponent', () => {
  let component: PaymentUploadsComponent;
  let fixture: ComponentFixture<PaymentUploadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentUploadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
