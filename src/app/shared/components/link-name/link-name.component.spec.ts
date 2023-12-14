import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkNameComponent } from './link-name.component';

describe('LinkNameComponent', () => {
  let component: LinkNameComponent;
  let fixture: ComponentFixture<LinkNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
