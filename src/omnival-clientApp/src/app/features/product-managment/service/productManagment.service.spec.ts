/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductManagmentService } from './productManagment.service';

describe('Service: ProductManagment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductManagmentService]
    });
  });

  it('should ...', inject([ProductManagmentService], (service: ProductManagmentService) => {
    expect(service).toBeTruthy();
  }));
});
