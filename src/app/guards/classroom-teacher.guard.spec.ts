import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { classroomTeacherGuard } from './classroom-teacher.guard';

describe('classroomTeacherGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => classroomTeacherGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
