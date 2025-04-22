import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousemanshipComponent } from './housemanship.component';

describe('HousemanshipComponent', () => {
  let component: HousemanshipComponent;
  let fixture: ComponentFixture<HousemanshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousemanshipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousemanshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
