/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PanelManagmentService } from './panel-managment.service';

describe('Service: PanelManagment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PanelManagmentService]
    });
  });

  it('should ...', inject([PanelManagmentService], (service: PanelManagmentService) => {
    expect(service).toBeTruthy();
  }));
});
