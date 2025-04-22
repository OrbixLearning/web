import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { classroomGuard } from './classroom.guard';

describe('classroomGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => classroomGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
