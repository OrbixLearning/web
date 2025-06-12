import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { learningPathGuard } from './learning-path.guard';

describe('learningPathGuard', () => {
	const executeGuard: CanActivateFn = (...guardParameters) =>
		TestBed.runInInjectionContext(() => learningPathGuard(...guardParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});
});
