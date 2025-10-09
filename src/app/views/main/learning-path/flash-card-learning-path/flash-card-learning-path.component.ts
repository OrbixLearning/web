import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DividerModule } from 'primeng/divider';
import { lastValueFrom } from 'rxjs';
import { HighlightButtonComponent } from '../../../../components/buttons/highlight-button/highlight-button.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { FlashCard } from '../../../../models/LearningPath/FlashCard';
import { FlashCardLearningPath } from '../../../../models/LearningPath/LearningPath';
import { FlashCardLearningPathStudy } from '../../../../models/LearningPath/LearningPathStudy';
import { LearningPathStudyService } from '../../../../services/learning-path-study.service';
import { LearningPathService } from '../../../../services/learning-path.service';
import { EditFlashCardPopUpComponent } from './edit-flash-card-pop-up/edit-flash-card-pop-up.component';

type FlashCardContext = {
	flashCard: FlashCard;
	opened: boolean;
};

@Component({
	selector: 'o-flash-card-learning-path',
	imports: [MatCardModule, MatButtonModule, MatIconModule, DividerModule, LoadingComponent, HighlightButtonComponent],
	templateUrl: './flash-card-learning-path.component.html',
	styleUrl: './flash-card-learning-path.component.scss',
})
export class FlashCardLearningPathComponent {
	service: LearningPathStudyService = inject(LearningPathStudyService);
	learningPathService: LearningPathService = inject(LearningPathService);
	dialog: MatDialog = inject(MatDialog);

	@Input() learningPathStudy!: FlashCardLearningPathStudy;
	@Input() mode: 'edit' | 'study' = 'edit';

	isLoading: boolean = false;
	flashCards: FlashCard[] = [];
	shuffledFlashCards: FlashCard[] = [];
	fcIndex: number = 0;
	fcContext: FlashCardContext[] = [];

	get flashCard(): FlashCard {
		return this.shuffledFlashCards[this.fcIndex];
	}

	ngOnInit() {
		this.setData();
	}

	setData() {
		this.flashCards = (this.learningPathStudy.learningPath as FlashCardLearningPath).flashCards!;
		const order: number[] = this.learningPathStudy.cardsOrder;
		if (order && order.length > 0) {
			this.shuffledFlashCards = order.map(index => this.flashCards[index]);
		}
		this.fcContext = this.shuffledFlashCards.map(flashCard => ({
			flashCard,
			opened: false,
		}));
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

	addFlashCard() {
		this.dialog
			.open(EditFlashCardPopUpComponent, {
				minWidth: '600px',
			})
			.afterClosed()
			.subscribe((result: FlashCard | undefined) => {
				if (result) {
					this.flashCards.push(result);
				}
			});
	}

	editFlashCard(index: number) {
		this.dialog
			.open(EditFlashCardPopUpComponent, {
				data: this.flashCards[index],
				minWidth: '600px',
			})
			.afterClosed()
			.subscribe((result: FlashCard | undefined) => {
				if (result) {
					this.flashCards[index] = result;
				}
			});
	}

	deleteFlashCard(index: number) {
		const data: ConfirmPopUpData = {
			title: `Tem certeza que deseja excluir o Flash Card ${index + 1}?`,
			message: 'Esta ação não pode ser desfeita.',
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async result => {
				if (result) {
					this.flashCards.splice(index, 1);
				}
			});
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

	async save() {
		this.isLoading = true;
		await lastValueFrom(
			this.learningPathService.editFlashCardLearningPath(this.learningPathStudy.learningPath.id, this.flashCards),
		)
			.then((learningPath: FlashCardLearningPath) => {
				this.learningPathStudy.learningPath = learningPath;
				this.flashCards = learningPath.flashCards!;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
