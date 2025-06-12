import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionLearningPathComponent } from './question-learning-path.component';

describe('QuestionLearningPathComponent', () => {
	let component: QuestionLearningPathComponent;
	let fixture: ComponentFixture<QuestionLearningPathComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [QuestionLearningPathComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(QuestionLearningPathComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
