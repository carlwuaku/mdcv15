import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassFailListComponent } from './pass-fail-list.component';

describe('PassFailListComponent', () => {
  let component: PassFailListComponent;
  let fixture: ComponentFixture<PassFailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassFailListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassFailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
