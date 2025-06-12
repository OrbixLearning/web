import { TestBed } from '@angular/core/testing';

import { LearningPathService } from './learning-path.service';

describe('LearningPathService', () => {
	let service: LearningPathService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LearningPathService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
