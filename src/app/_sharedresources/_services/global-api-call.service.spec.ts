import { TestBed } from '@angular/core/testing';

import { GlobalApiCallService } from './global-api-call.service';

describe('GlobalApiCallService', () => {
  let service: GlobalApiCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalApiCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
