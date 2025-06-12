import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioLearningPathComponent } from './audio-learning-path.component';

describe('AudioLearningPathComponent', () => {
	let component: AudioLearningPathComponent;
	let fixture: ComponentFixture<AudioLearningPathComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AudioLearningPathComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AudioLearningPathComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
