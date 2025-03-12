import { TestBed } from '@angular/core/testing';

import { OffDayService } from './off-day.service';

describe('OffDayService', () => {
  let service: OffDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffDayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
