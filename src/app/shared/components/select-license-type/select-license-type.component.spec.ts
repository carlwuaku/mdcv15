import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLicenseTypeComponent } from './select-license-type.component';

describe('SelectLicenseTypeComponent', () => {
  let component: SelectLicenseTypeComponent;
  let fixture: ComponentFixture<SelectLicenseTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectLicenseTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectLicenseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
