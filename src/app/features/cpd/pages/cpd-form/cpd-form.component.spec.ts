import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdFormComponent } from './cpd-form.component';

describe('CpdFormComponent', () => {
  let component: CpdFormComponent;
  let fixture: ComponentFixture<CpdFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
