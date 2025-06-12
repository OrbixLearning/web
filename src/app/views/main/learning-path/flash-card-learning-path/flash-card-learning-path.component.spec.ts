import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashCardRoadmapComponent } from './flash-card-learning-path.component';

describe('FlashCardRoadmapComponent', () => {
	let component: FlashCardRoadmapComponent;
	let fixture: ComponentFixture<FlashCardRoadmapComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [FlashCardRoadmapComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FlashCardRoadmapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
