import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlashCard } from '../../../../models/LearningPath/FlashCard';
import { FlashCardLearningPath } from '../../../../models/LearningPath/LearningPath';
import { FlashCardLearningPathStudy, LearningPathStudy } from '../../../../models/LearningPath/LearningPathStudy';
import { DividerModule } from 'primeng/divider';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { LearningPathStudyService } from '../../../../services/learning-path-study.service';
import { ChatComponent } from '../../../../components/chat/chat.component';
import { lastValueFrom } from 'rxjs';

type FlashCardContext = {
	flashCard: FlashCard;
	opened: boolean;
};

@Component({
	selector: 'o-flash-card-learning-path',
	imports: [MatCardModule, MatButtonModule, MatIconModule, DividerModule, LoadingComponent, ChatComponent],
	templateUrl: './flash-card-learning-path.component.html',
	styleUrl: './flash-card-learning-path.component.scss',
})
export class FlashCardLearningPathComponent {
	service: LearningPathStudyService = inject(LearningPathStudyService);

	@Input() learningPathStudy!: FlashCardLearningPathStudy;
	@Input() mode: 'view' | 'study' = 'view';

	isLoading: boolean = false;
	flashCards: FlashCard[] = [];
	fcIndex: number = 0;
	fcContext: FlashCardContext[] = [];

	get flashCard(): FlashCard {
		return this.flashCards[this.fcIndex];
	}

	ngOnInit() {
		this.setData();
	}

	setData() {
		const unorderedFC = (this.learningPathStudy.learningPath as FlashCardLearningPath).flashCards!;
		const order: number[] = this.learningPathStudy.cardsOrder;
		if (order && order.length > 0) {
			this.flashCards = order.map(index => unorderedFC[index]);
		}
		this.fcContext = this.flashCards.map(flashCard => ({
			flashCard,
			opened: false,
		}));
	}

	openAll() {
		this.fcContext.forEach(context => (context.opened = true));
	}

	closeAll() {
		this.fcContext.forEach(context => (context.opened = false));
	}

	prev() {
		if (this.fcIndex > 0) {
			this.fcIndex--;
		}
	}

	next() {
		if (this.fcIndex < this.fcContext.length - 1) {
			this.fcIndex++;
		}
	}

	async shuffle() {
		this.isLoading = true;
		lastValueFrom(this.service.shuffle(this.learningPathStudy.id))
			.then((lps: FlashCardLearningPathStudy) => {
				this.learningPathStudy = lps;
				this.fcIndex = 0;
				this.setData();
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
