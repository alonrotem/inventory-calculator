import { TestBed } from '@angular/core/testing';

import { HatsService } from './hats.service';

describe('HatsService', () => {
  let service: HatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
