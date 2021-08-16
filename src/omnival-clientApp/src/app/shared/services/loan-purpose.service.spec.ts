/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoanPurposeService } from './loan-purpose.service';

describe('Service: LoanPurpose', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanPurposeService]
    });
  });

  it('should ...', inject([LoanPurposeService], (service: LoanPurposeService) => {
    expect(service).toBeTruthy();
  }));
});
