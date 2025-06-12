import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashCardLearningPathComponent } from './flash-card-learning-path.component';

describe('FlashCardLearningPathComponent', () => {
	let component: FlashCardLearningPathComponent;
	let fixture: ComponentFixture<FlashCardLearningPathComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FlashCardLearningPathComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FlashCardLearningPathComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
