import { TestBed } from '@angular/core/testing';

import { UnsavedNavigationConfirmationService } from './unsaved-navigation-confirmation.service';

describe('UnsavedNavigationConfirmationService', () => {
  let service: UnsavedNavigationConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnsavedNavigationConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
