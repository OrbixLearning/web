import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlashCard, FlashCardRoadmap } from '../../../../models/LearningPath';
import { FlashCardRoadmapStudy } from '../../../../models/LearningPathStudy';

@Component({
	selector: 'o-flash-card-roadmap',
	imports: [MatCardModule, MatButtonModule],
	templateUrl: './flash-card-learning-path.component.html',
	styleUrl: './flash-card-learning-path.component.scss',
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
