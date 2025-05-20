import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingApplicationsComponent } from './posting-applications.component';

describe('PostingApplicationsComponent', () => {
  let component: PostingApplicationsComponent;
  let fixture: ComponentFixture<PostingApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostingApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
