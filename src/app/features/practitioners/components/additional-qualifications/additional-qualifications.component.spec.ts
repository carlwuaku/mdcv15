import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalQualificationsComponent } from './additional-qualifications.component';

describe('AdditionalQualificationsComponent', () => {
  let component: AdditionalQualificationsComponent;
  let fixture: ComponentFixture<AdditionalQualificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalQualificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalQualificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
