import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseCpdHistoryComponent } from './license-cpd-history.component';

describe('LicenseCpdHistoryComponent', () => {
  let component: LicenseCpdHistoryComponent;
  let fixture: ComponentFixture<LicenseCpdHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseCpdHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseCpdHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
