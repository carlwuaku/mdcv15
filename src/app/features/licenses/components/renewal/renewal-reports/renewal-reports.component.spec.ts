import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalReportsComponent } from './renewal-reports.component';

describe('RenewalReportsComponent', () => {
  let component: RenewalReportsComponent;
  let fixture: ComponentFixture<RenewalReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewalReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
