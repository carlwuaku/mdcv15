import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersFormComponent } from './providers-form.component';

describe('ProvidersFormComponent', () => {
  let component: ProvidersFormComponent;
  let fixture: ComponentFixture<ProvidersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvidersFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvidersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
