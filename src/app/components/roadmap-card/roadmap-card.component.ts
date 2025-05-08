import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { Roadmap } from '../../models/Roadmap';

@Component({
	selector: 'o-roadmap-card',
	imports: [CardModule, TagModule],
	templateUrl: './roadmap-card.component.html',
	styleUrl: './roadmap-card.component.scss',
})
export class RoadmapCardComponent {
	@Input() roadmap!: Roadmap;
	@Output() cardClick: EventEmitter<void> = new EventEmitter<void>();
}
