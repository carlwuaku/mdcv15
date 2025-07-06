import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExamRegistrationComponent } from './add-exam-registration.component';

describe('AddExamRegistrationComponent', () => {
  let component: AddExamRegistrationComponent;
  let fixture: ComponentFixture<AddExamRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExamRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExamRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
