import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlashCard, FlashCardRoadmap } from '../../../../models/Roadmap';
import { FlashCardRoadmapStudy } from '../../../../models/RoadmapStudy';

@Component({
	selector: 'o-flash-card-roadmap',
	imports: [MatCardModule, MatButtonModule],
	templateUrl: './flash-card-roadmap.component.html',
	styleUrl: './flash-card-roadmap.component.scss',
})
export class FlashCardRoadmapComponent {
	@Input() roadmapStudy!: FlashCardRoadmapStudy;

	flashCards: FlashCard[] = [];
	opened: boolean[] = [];

	ngOnInit() {
		this.flashCards = (this.roadmapStudy.roadmap as FlashCardRoadmap).flashCards;
		this.opened = this.flashCards.map(() => false);
	}
}
