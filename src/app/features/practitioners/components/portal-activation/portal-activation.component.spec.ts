import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalActivationComponent } from './portal-activation.component';

describe('PortalActivationComponent', () => {
  let component: PortalActivationComponent;
  let fixture: ComponentFixture<PortalActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortalActivationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
