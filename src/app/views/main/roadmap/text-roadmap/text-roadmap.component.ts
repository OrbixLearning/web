import { Component, Input } from '@angular/core';
import { TextRoadmap } from '../../../../models/Roadmap';

@Component({
	selector: 'o-text-roadmap',
	imports: [],
	templateUrl: './text-roadmap.component.html',
	styleUrl: './text-roadmap.component.scss',
})
export class TextRoadmapComponent {
	@Input() roadmap!: TextRoadmap;
}
