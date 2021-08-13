/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClientTypeService } from './clientType.service';

describe('Service: ClientType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientTypeService]
    });
  });

  it('should ...', inject([ClientTypeService], (service: ClientTypeService) => {
    expect(service).toBeTruthy();
  }));
});
