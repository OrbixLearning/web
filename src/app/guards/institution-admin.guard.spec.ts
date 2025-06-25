import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { institutionAdminGuard } from './institution-admin.guard';

describe('institutionAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => institutionAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
