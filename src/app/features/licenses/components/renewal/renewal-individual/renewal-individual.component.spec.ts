import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalIndividualComponent } from './renewal-individual.component';

describe('RenewalIndividualComponent', () => {
  let component: RenewalIndividualComponent;
  let fixture: ComponentFixture<RenewalIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalIndividualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewalIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
