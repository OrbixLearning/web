import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioRoadmapComponent } from './audio-learning-path.component';

describe('AudioRoadmapComponent', () => {
	let component: AudioRoadmapComponent;
	let fixture: ComponentFixture<AudioRoadmapComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AudioRoadmapComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AudioRoadmapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
