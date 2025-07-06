import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCustomLetterComponent } from './set-custom-letter.component';

describe('SetCustomLetterComponent', () => {
  let component: SetCustomLetterComponent;
  let fixture: ComponentFixture<SetCustomLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCustomLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetCustomLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
