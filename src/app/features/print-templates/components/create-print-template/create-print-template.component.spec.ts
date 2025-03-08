import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrintTemplateComponent } from './create-print-template.component';

describe('CreatePrintTemplateComponent', () => {
  let component: CreatePrintTemplateComponent;
  let fixture: ComponentFixture<CreatePrintTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePrintTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePrintTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
