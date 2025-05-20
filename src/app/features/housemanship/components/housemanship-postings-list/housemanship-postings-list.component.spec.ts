import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousemanshipPostingsListComponent } from './housemanship-postings-list.component';

describe('HousemanshipPostingsListComponent', () => {
  let component: HousemanshipPostingsListComponent;
  let fixture: ComponentFixture<HousemanshipPostingsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousemanshipPostingsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousemanshipPostingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
