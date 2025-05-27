import { Component, Input } from '@angular/core';
import { QuestionRoadmap } from '../../../../models/Roadmap';

@Component({
	selector: 'o-question-roadmap',
	imports: [],
	templateUrl: './question-roadmap.component.html',
	styleUrl: './question-roadmap.component.scss',
})
export class QuestionRoadmapComponent {
	@Input() roadmap!: QuestionRoadmap;
}
