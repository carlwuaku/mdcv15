import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignIndexNumbersComponent } from './assign-index-numbers.component';

describe('AssignIndexNumbersComponent', () => {
  let component: AssignIndexNumbersComponent;
  let fixture: ComponentFixture<AssignIndexNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignIndexNumbersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignIndexNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
