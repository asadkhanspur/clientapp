/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PropertyTypeService } from './property-type.service';

describe('Service: PropertyType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyTypeService]
    });
  });

  it('should ...', inject([PropertyTypeService], (service: PropertyTypeService) => {
    expect(service).toBeTruthy();
  }));
});
