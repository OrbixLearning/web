import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { LearningPath } from '../../models/LearningPath/LearningPath';
import { SyllabusTagsComponent } from '../syllabus-tags/syllabus-tags.component';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule } from 'primeng/tooltip';

@Component({
	selector: 'o-learning-path-card',
	imports: [
		CardModule,
		TagModule,
		ToggleSwitchModule,
		FormsModule,
		SyllabusTagsComponent,
		MatIconModule,
		TooltipModule,
	],
	templateUrl: './learning-path-card.component.html',
	styleUrl: './learning-path-card.component.scss',
})
export class LearningPathCardComponent {
	@Input() learningPath!: LearningPath;
	@Input() mine: boolean = false;
	@Output() cardClick: EventEmitter<void> = new EventEmitter<void>();
	@Output() sharedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
}
