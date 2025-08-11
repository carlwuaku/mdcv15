import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDesignerComponent } from './template-designer.component';

describe('TemplateDesignerComponent', () => {
  let component: TemplateDesignerComponent;
  let fixture: ComponentFixture<TemplateDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateDesignerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
