import { Component, Input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { TextRoadmap } from '../../../../models/Roadmap';
import { TextRoadmapStudy } from '../../../../models/RoadmapStudy';

@Component({
	selector: 'o-text-roadmap',
	imports: [MarkdownModule],
	templateUrl: './text-roadmap.component.html',
	styleUrl: './text-roadmap.component.scss',
})
export class TextRoadmapComponent {
	@Input() roadmapStudy!: TextRoadmapStudy;

	text: string = '';

	ngOnInit() {
		this.text = (this.roadmapStudy.roadmap as TextRoadmap).text;
	}
}
