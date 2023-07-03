import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetImageComponent } from './asset-image.component';

describe('AssetImageComponent', () => {
  let component: AssetImageComponent;
  let fixture: ComponentFixture<AssetImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
