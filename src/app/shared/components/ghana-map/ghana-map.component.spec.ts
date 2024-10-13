import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhanaMapComponent } from './ghana-map.component';

describe('GhanaMapComponent', () => {
  let component: GhanaMapComponent;
  let fixture: ComponentFixture<GhanaMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GhanaMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GhanaMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
