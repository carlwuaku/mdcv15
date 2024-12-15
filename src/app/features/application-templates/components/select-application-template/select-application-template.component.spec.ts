import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectApplicationTemplateComponent } from './select-application-template.component';

describe('SelectApplicationTemplateComponent', () => {
  let component: SelectApplicationTemplateComponent;
  let fixture: ComponentFixture<SelectApplicationTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectApplicationTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectApplicationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
