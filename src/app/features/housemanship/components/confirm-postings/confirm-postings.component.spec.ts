import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPostingsComponent } from './confirm-postings.component';

describe('ConfirmPostingsComponent', () => {
  let component: ConfirmPostingsComponent;
  let fixture: ComponentFixture<ConfirmPostingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmPostingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmPostingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
