import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableTwoFactorAuthenticationComponent } from './enable-two-factor-authentication.component';

describe('EnableTwoFactorAuthenticationComponent', () => {
  let component: EnableTwoFactorAuthenticationComponent;
  let fixture: ComponentFixture<EnableTwoFactorAuthenticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnableTwoFactorAuthenticationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnableTwoFactorAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
