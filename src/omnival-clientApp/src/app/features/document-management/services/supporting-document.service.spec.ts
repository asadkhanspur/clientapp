/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SupportingDocumentService } from './supporting-document.service';

describe('Service: SupportingDocument', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupportingDocumentService]
    });
  });

  it('should ...', inject([SupportingDocumentService], (service: SupportingDocumentService) => {
    expect(service).toBeTruthy();
  }));
});
