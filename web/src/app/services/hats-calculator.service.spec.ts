import { TestBed } from '@angular/core/testing';

import { HatsCalculatorService } from './hats-calculator.service';

describe('HatsCalculatorService', () => {
  let service: HatsCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HatsCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
