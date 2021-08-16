/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PropertyCategoryTypeService } from './property-category-type.service';

describe('Service: PropertyCategoryType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyCategoryTypeService]
    });
  });

  it('should ...', inject([PropertyCategoryTypeService], (service: PropertyCategoryTypeService) => {
    expect(service).toBeTruthy();
  }));
});
