import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGuestUserComponent } from './add-guest-user.component';

describe('AddGuestUserComponent', () => {
  let component: AddGuestUserComponent;
  let fixture: ComponentFixture<AddGuestUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGuestUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGuestUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
