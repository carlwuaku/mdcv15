import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRenewalsComponent } from './manage-renewals.component';

describe('ManageRenewalsComponent', () => {
  let component: ManageRenewalsComponent;
  let fixture: ComponentFixture<ManageRenewalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRenewalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
