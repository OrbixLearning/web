import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Roadmap } from '../../models/Roadmap';
import { SyllabusTagsComponent } from '../syllabus-tags/syllabus-tags.component';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule } from 'primeng/tooltip';

@Component({
	selector: 'o-roadmap-card',
	imports: [
		CardModule,
		TagModule,
		ToggleSwitchModule,
		FormsModule,
		SyllabusTagsComponent,
		MatIconModule,
		TooltipModule,
	],
	templateUrl: './roadmap-card.component.html',
	styleUrl: './roadmap-card.component.scss',
})
export class RoadmapCardComponent {
	@Input() roadmap!: Roadmap;
	@Input() mine: boolean = false;
	@Output() cardClick: EventEmitter<void> = new EventEmitter<void>();
	@Output() sharedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
}
