import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCheckListComponent } from './review-check-list.component';

describe('ReviewCheckListComponent', () => {
  let component: ReviewCheckListComponent;
  let fixture: ComponentFixture<ReviewCheckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewCheckListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
