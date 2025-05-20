import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingApplicationFormComponent } from './posting-application-form.component';

describe('PostingApplicationFormComponent', () => {
  let component: PostingApplicationFormComponent;
  let fixture: ComponentFixture<PostingApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingApplicationFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostingApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
