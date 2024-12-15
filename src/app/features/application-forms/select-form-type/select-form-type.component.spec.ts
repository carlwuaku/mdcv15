import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFormTypeComponent } from './select-form-type.component';

describe('SelectFormTypeComponent', () => {
  let component: SelectFormTypeComponent;
  let fixture: ComponentFixture<SelectFormTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectFormTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectFormTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
