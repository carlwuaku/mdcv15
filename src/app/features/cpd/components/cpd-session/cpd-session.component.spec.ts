import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpdSessionComponent } from './cpd-session.component';

describe('CpdSessionComponent', () => {
  let component: CpdSessionComponent;
  let fixture: ComponentFixture<CpdSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpdSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpdSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
