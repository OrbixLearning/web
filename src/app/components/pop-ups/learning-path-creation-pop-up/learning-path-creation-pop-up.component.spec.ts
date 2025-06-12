import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapCreationPopUpComponent } from './learning-path-creation-pop-up.component';

describe('RoadmapCreationPopUpComponent', () => {
	let component: RoadmapCreationPopUpComponent;
	let fixture: ComponentFixture<RoadmapCreationPopUpComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RoadmapCreationPopUpComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RoadmapCreationPopUpComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
