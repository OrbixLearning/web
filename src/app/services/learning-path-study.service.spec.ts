import { TestBed } from '@angular/core/testing';

import { LearningPathStudyService } from './learning-path-study.service';

describe('LearningPathStudyService', () => {
	let service: LearningPathStudyService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LearningPathStudyService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
