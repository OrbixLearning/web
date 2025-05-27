import { Component, Input } from '@angular/core';
import { FlashCardRoadmap } from '../../../../models/Roadmap';

@Component({
	selector: 'o-flash-card-roadmap',
	imports: [],
	templateUrl: './flash-card-roadmap.component.html',
	styleUrl: './flash-card-roadmap.component.scss',
})
export class FlashCardRoadmapComponent {
	@Input() roadmap!: FlashCardRoadmap;
}
