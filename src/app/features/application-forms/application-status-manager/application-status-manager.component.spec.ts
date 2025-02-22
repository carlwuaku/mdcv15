import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationStatusManagerComponent } from './application-status-manager.component';

describe('ApplicationStatusManagerComponent', () => {
  let component: ApplicationStatusManagerComponent;
  let fixture: ComponentFixture<ApplicationStatusManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationStatusManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationStatusManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
