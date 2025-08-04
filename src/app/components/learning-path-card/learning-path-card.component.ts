import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { LearningPath } from '../../models/LearningPath/LearningPath';
import { SyllabusTagsComponent } from '../syllabus-tags/syllabus-tags.component';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule } from 'primeng/tooltip';
import { LearningPathGenerationStatusEnum } from '../../enums/LearningPathGenerationStatus.enum';
import { LoadingComponent } from '../loading/loading.component';
import { MatButtonModule } from '@angular/material/button';

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
		LoadingComponent,
		MatButtonModule,
	],
	templateUrl: './learning-path-card.component.html',
	styleUrl: './learning-path-card.component.scss',
})
export class LearningPathCardComponent {
	@Input() learningPath!: LearningPath;
	@Input() mine: boolean = false;
	@Input() inChat: boolean = false;
	@Output() cardClick: EventEmitter<void> = new EventEmitter<void>();
	@Output() sharedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() regenerate: EventEmitter<void> = new EventEmitter<void>();
	@Output() addToChat: EventEmitter<void> = new EventEmitter<void>();

	generated: boolean = false;
	generating: boolean = false;
	failed: boolean = false;

	ngOnInit() {
		const status = this.learningPath.generation.status;
		this.generated = status === LearningPathGenerationStatusEnum.GENERATED;
		this.generating = status === LearningPathGenerationStatusEnum.GENERATING;
		this.failed = status === LearningPathGenerationStatusEnum.FAILED;
	}
}
