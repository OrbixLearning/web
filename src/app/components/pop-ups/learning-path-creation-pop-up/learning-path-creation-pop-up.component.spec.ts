import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningPathCreationPopUpComponent } from './learning-path-creation-pop-up.component';

describe('LearningPathCreationPopUpComponent', () => {
	let component: LearningPathCreationPopUpComponent;
	let fixture: ComponentFixture<LearningPathCreationPopUpComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LearningPathCreationPopUpComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(LearningPathCreationPopUpComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
