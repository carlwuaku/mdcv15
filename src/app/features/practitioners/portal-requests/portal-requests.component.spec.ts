import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalRequestsComponent } from './portal-requests.component';

describe('PortalRequestsComponent', () => {
  let component: PortalRequestsComponent;
  let fixture: ComponentFixture<PortalRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortalRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortalRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
