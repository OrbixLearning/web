import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextRoadmapComponent } from './text-learning-path.component';

describe('TextRoadmapComponent', () => {
	let component: TextRoadmapComponent;
	let fixture: ComponentFixture<TextRoadmapComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TextRoadmapComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TextRoadmapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
