import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerDetailsComponent } from './practitioner-details.component';

describe('PractitionerDetailsComponent', () => {
  let component: PractitionerDetailsComponent;
  let fixture: ComponentFixture<PractitionerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PractitionerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PractitionerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
