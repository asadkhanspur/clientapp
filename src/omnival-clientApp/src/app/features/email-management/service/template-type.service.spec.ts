/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TemplateTypeService } from './template-type.service';

describe('Service: TemplateType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateTypeService]
    });
  });

  it('should ...', inject([TemplateTypeService], (service: TemplateTypeService) => {
    expect(service).toBeTruthy();
  }));
});
