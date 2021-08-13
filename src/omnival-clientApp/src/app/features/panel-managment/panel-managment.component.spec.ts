import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelManagmentComponent } from './panel-managment.component';

describe('PanelManagmentComponent', () => {
  let component: PanelManagmentComponent;
  let fixture: ComponentFixture<PanelManagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
