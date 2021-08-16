/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OccupancyTypeService } from './occupancy-type.service';

describe('Service: OccupancyType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OccupancyTypeService]
    });
  });

  it('should ...', inject([OccupancyTypeService], (service: OccupancyTypeService) => {
    expect(service).toBeTruthy();
  }));
});
