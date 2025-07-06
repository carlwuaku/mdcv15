import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePublishResultComponent } from './manage-publish-result.component';

describe('ManagePublishResultComponent', () => {
  let component: ManagePublishResultComponent;
  let fixture: ComponentFixture<ManagePublishResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePublishResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePublishResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
