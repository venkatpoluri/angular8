import { TestBed, inject } from '@angular/core/testing';

import { CcapiService } from './ccapi.service';

describe('CcapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CcapiService]
    });
  });

  it('should be created', inject([CcapiService], (service: CcapiService) => {
    expect(service).toBeTruthy();
  }));
});
