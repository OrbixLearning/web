import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roadmapGuard } from './roadmap.guard';

describe('roadmapGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roadmapGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
