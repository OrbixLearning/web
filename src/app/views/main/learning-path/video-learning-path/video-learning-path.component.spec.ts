import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLearningPathComponent } from './video-learning-path.component';

describe('VideoLearningPathComponent', () => {
	let component: VideoLearningPathComponent;
	let fixture: ComponentFixture<VideoLearningPathComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [VideoLearningPathComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(VideoLearningPathComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
