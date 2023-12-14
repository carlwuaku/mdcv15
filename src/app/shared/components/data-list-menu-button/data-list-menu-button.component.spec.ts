import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataListMenuButtonComponent } from './data-list-menu-button.component';

describe('DataListMenuButtonComponent', () => {
  let component: DataListMenuButtonComponent;
  let fixture: ComponentFixture<DataListMenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataListMenuButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataListMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
