import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSectionContainerComponent } from './sub-section-container.component';

describe('SubSectionContainerComponent', () => {
  let component: SubSectionContainerComponent;
  let fixture: ComponentFixture<SubSectionContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubSectionContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubSectionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
