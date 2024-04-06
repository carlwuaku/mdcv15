import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogKeyValueDisplayComponent } from './dialog-key-value-display.component';

describe('DialogKeyValueDisplayComponent', () => {
  let component: DialogKeyValueDisplayComponent;
  let fixture: ComponentFixture<DialogKeyValueDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogKeyValueDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogKeyValueDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
