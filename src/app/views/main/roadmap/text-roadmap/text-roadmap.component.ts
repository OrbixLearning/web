import { Component, Input } from '@angular/core';
import { TextRoadmap } from '../../../../models/Roadmap';
import { MarkdownModule } from 'ngx-markdown';

@Component({
	selector: 'o-text-roadmap',
	imports: [MarkdownModule],
	templateUrl: './text-roadmap.component.html',
	styleUrl: './text-roadmap.component.scss',
})
export class TextRoadmapComponent {
	@Input() roadmap!: TextRoadmap;
}
