import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiCountComponent } from './api-count.component';

describe('ApiCountComponent', () => {
  let component: ApiCountComponent;
  let fixture: ComponentFixture<ApiCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
