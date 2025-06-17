import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlashCard } from '../../../../models/LearningPath/FlashCard';
import { FlashCardLearningPath } from '../../../../models/LearningPath/LearningPath';
import { FlashCardLearningPathStudy } from '../../../../models/LearningPath/LearningPathStudy';

@Component({
	selector: 'o-flash-card-learning-path',
	imports: [MatCardModule, MatButtonModule],
	templateUrl: './flash-card-learning-path.component.html',
	styleUrl: './flash-card-learning-path.component.scss',
})
export class FlashCardLearningPathComponent {
	@Input() learningPathStudy!: FlashCardLearningPathStudy;

	flashCards: FlashCard[] = [];
	opened: boolean[] = [];

	ngOnInit() {
		this.flashCards = (this.learningPathStudy.learningPath as FlashCardLearningPath).flashCards;
		this.opened = this.flashCards.map(() => false);
	}
}
