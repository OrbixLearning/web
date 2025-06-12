import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextLearningPathComponent } from './text-learning-path.component';

describe('TextLearningPathComponent', () => {
	let component: TextLearningPathComponent;
	let fixture: ComponentFixture<TextLearningPathComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TextLearningPathComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TextLearningPathComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
