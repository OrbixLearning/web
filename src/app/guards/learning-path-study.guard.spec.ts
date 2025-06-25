import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { learningPathStudyGuard } from './learning-path-study.guard';

describe('learningPathStudyGuard', () => {
	const executeGuard: CanActivateFn = (...guardParameters) =>
		TestBed.runInInjectionContext(() => learningPathStudyGuard(...guardParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});
});
