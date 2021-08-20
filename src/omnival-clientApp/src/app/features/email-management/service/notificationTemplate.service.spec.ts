/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NotificationTemplateService } from './notificationTemplate.service';

describe('Service: NotificationTemplate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationTemplateService]
    });
  });

  it('should ...', inject([NotificationTemplateService], (service: NotificationTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
