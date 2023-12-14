import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepMessagingComponent } from './prep-messaging.component';

describe('PrepMessagingComponent', () => {
  let component: PrepMessagingComponent;
  let fixture: ComponentFixture<PrepMessagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepMessagingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepMessagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
