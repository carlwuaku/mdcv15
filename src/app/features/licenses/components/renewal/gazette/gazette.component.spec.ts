import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GazetteComponent } from './gazette.component';

describe('GazetteComponent', () => {
  let component: GazetteComponent;
  let fixture: ComponentFixture<GazetteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GazetteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GazetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
