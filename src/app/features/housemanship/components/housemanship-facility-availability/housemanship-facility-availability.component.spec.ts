import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousemanshipFacilityAvailabilityComponent } from './housemanship-facility-availability.component';

describe('HousemanshipFacilityAvailabilityComponent', () => {
  let component: HousemanshipFacilityAvailabilityComponent;
  let fixture: ComponentFixture<HousemanshipFacilityAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousemanshipFacilityAvailabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousemanshipFacilityAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
