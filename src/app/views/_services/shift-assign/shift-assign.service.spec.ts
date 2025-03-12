import { TestBed } from '@angular/core/testing';

import { ShiftAssignService } from './shift-assign.service';

describe('ShiftAssignService', () => {
  let service: ShiftAssignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftAssignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
