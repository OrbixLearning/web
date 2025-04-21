import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { institutionGuard } from './institution.guard';

describe('institutionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => institutionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
