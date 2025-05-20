import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousemanshipFacilityCapacitiesComponent } from './housemanship-facility-capacities.component';

describe('HousemanshipFacilityCapacitiesComponent', () => {
  let component: HousemanshipFacilityCapacitiesComponent;
  let fixture: ComponentFixture<HousemanshipFacilityCapacitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousemanshipFacilityCapacitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousemanshipFacilityCapacitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
