import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayLinksComponent } from './array-links.component';

describe('ArrayLinksComponent', () => {
  let component: ArrayLinksComponent;
  let fixture: ComponentFixture<ArrayLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrayLinksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrayLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
