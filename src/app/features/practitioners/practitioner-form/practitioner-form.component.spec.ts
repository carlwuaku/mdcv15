import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerFormComponent } from './practitioner-form.component';

describe('PractitionerFormComponent', () => {
  let component: PractitionerFormComponent;
  let fixture: ComponentFixture<PractitionerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PractitionerFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PractitionerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
