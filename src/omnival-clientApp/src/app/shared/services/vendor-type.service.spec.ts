/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VendorTypeService } from './vendor-type.service';

describe('Service: VendorType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorTypeService]
    });
  });

  it('should ...', inject([VendorTypeService], (service: VendorTypeService) => {
    expect(service).toBeTruthy();
  }));
});
