import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalCertificateComponent } from './renewal-certificate.component';

describe('RenewalCertificateComponent', () => {
  let component: RenewalCertificateComponent;
  let fixture: ComponentFixture<RenewalCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewalCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
