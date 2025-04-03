import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHtmlContentComponent } from './view-html-content.component';

describe('ViewHtmlContentComponent', () => {
  let component: ViewHtmlContentComponent;
  let fixture: ComponentFixture<ViewHtmlContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHtmlContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHtmlContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
