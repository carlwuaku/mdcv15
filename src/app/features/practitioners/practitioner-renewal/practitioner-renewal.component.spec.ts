import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerRenewalComponent } from './practitioner-renewal.component';

describe('PractitionerRenewalComponent', () => {
  let component: PractitionerRenewalComponent;
  let fixture: ComponentFixture<PractitionerRenewalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PractitionerRenewalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PractitionerRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
