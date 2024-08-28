import { TestBed } from '@angular/core/testing';

import { WingsService } from './wings.service';

describe('WingsService', () => {
  let service: WingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
