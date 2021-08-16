/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoanTypeService } from './loan-type.service';

describe('Service: LoanType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanTypeService]
    });
  });

  it('should ...', inject([LoanTypeService], (service: LoanTypeService) => {
    expect(service).toBeTruthy();
  }));
});
