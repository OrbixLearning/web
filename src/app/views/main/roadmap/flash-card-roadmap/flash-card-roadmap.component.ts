import { Component, Input } from '@angular/core';
import { FlashCard, FlashCardRoadmap } from '../../../../models/Roadmap';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'o-flash-card-roadmap',
	imports: [MatCardModule, MatButtonModule],
	templateUrl: './flash-card-roadmap.component.html',
	styleUrl: './flash-card-roadmap.component.scss',
})
export class FlashCardRoadmapComponent {
	@Input() roadmap!: FlashCardRoadmap;

	opened: boolean[] = [];

	ngOnInit() {
		this.opened = this.roadmap.flashCards.map(() => false);
	}
}
