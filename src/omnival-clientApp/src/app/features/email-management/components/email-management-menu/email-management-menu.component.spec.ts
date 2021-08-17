/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmailManagementMenuComponent } from './email-management-menu.component';

describe('EmailManagementMenuComponent', () => {
  let component: EmailManagementMenuComponent;
  let fixture: ComponentFixture<EmailManagementMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailManagementMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailManagementMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
