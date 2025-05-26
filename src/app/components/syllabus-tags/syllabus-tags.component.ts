import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { Syllabus } from '../../models/Syllabus';

@Component({
	selector: 'o-syllabus-tags',
	imports: [TagModule],
	templateUrl: './syllabus-tags.component.html',
	styleUrl: './syllabus-tags.component.scss',
})
export class SyllabusTagsComponent {
	@Input() syllabus: Syllabus[] = [];
}
