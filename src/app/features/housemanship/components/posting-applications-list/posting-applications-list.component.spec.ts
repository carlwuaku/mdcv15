import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingApplicationsListComponent } from './posting-applications-list.component';

describe('PostingApplicationsListComponent', () => {
  let component: PostingApplicationsListComponent;
  let fixture: ComponentFixture<PostingApplicationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingApplicationsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostingApplicationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
