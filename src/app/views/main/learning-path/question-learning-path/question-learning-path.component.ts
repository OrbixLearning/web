import { Component, inject, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { lastValueFrom } from 'rxjs';
import { HighlightButtonComponent } from '../../../../components/buttons/highlight-button/highlight-button.component';
import { TextButtonComponent } from '../../../../components/buttons/text-button/text-button.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import {
	SuccessPopUpComponent,
	SuccessPopUpData,
} from '../../../../components/pop-ups/success-pop-up/success-pop-up.component';
import { QuestionTypeEnum } from '../../../../enums/QuestionType.enum';
import { QuestionLearningPath } from '../../../../models/LearningPath/LearningPath';
import { QuestionLearningPathStudy } from '../../../../models/LearningPath/LearningPathStudy';
import { Question } from '../../../../models/LearningPath/Question';
import { LearningPathStudyService } from '../../../../services/learning-path-study.service';
import { LearningPathService } from '../../../../services/learning-path.service';
import { EditMultipleChoicePopUpComponent } from './edit-multiple-choice-pop-up/edit-multiple-choice-pop-up.component';
import { EditMultipleSelectionPopUpComponent } from './edit-multiple-selection-pop-up/edit-multiple-selection-pop-up.component';
import { EditOpenEndedPopUpComponent } from './edit-open-ended-pop-up/edit-open-ended-pop-up.component';
import { EditTrueFalsePopUpComponent } from './edit-true-false-pop-up/edit-true-false-pop-up.component';

type QuestionContext = {
	question: Question;
	userAnswer: string[];
};

@Component({
	selector: 'o-question-learning-path',
	imports: [
		MatButtonModule,
		MatRadioModule,
		MatCheckboxModule,
		MatButtonToggleModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		HighlightButtonComponent,
		TextButtonComponent,
		MatListModule,
		LoadingComponent,
		MatMenuModule,
	],
	templateUrl: './question-learning-path.component.html',
	styleUrl: './question-learning-path.component.scss',
})
export class QuestionLearningPathComponent {
	@Input() learningPathStudy!: QuestionLearningPathStudy;
	@Input() mode: 'edit' | 'study' = 'edit';

	formBuilder: FormBuilder = inject(FormBuilder);
	dialog: MatDialog = inject(MatDialog);
	service: LearningPathStudyService = inject(LearningPathStudyService);
	learningPathService: LearningPathService = inject(LearningPathService);

	isLoading: boolean = false;
	questions: Question[] = [];
	questionsContext: QuestionContext[] = [];
	index: number = 0;
	questionContext?: QuestionContext;
	questionTypeEnum = QuestionTypeEnum;
	showAnswers: boolean = false;
	amountOfIncorrectAnswers: number = 0;
	openEndedQuestionsDebounceTimer: any;

	get question(): Question | undefined {
		return this.questionContext?.question;
	}

	get userAnswer(): string[] {
		return this.questionContext?.userAnswer || [];
	}

	get currentQuestionAnswer(): string {
		return this.question?.answers.join(', ') || '';
	}

	ngOnInit() {
		this.startData();
	}

	startData() {
		this.questions = (this.learningPathStudy.learningPath as QuestionLearningPath).questions!;
		const userAnswers =
			(this.learningPathStudy as QuestionLearningPathStudy).userAnswers || this.questions.map(() => []);
		for (let i = 0; i < this.questions.length; i++) {
			this.questionsContext.push({
				question: this.questions[i],
				userAnswer: userAnswers[i].answer || [],
			});
		}
		this.questionContext = this.questionsContext[this.index];
	}

	markSingle(option: string) {
		this.questionContext!.userAnswer = [option];
		const questionIndex = this.index;
		const answer = this.questionContext!.userAnswer;
		this.saveAnswer(questionIndex, answer);
	}

	markMulti(option: string) {
		if (this.questionContext!.userAnswer.includes(option)) {
			this.questionContext!.userAnswer.filter((answer: string) => answer !== option);
		} else {
			this.questionContext!.userAnswer = [...this.questionContext!.userAnswer, option];
		}
		const questionIndex = this.index;
		const answer = this.questionContext!.userAnswer;
		this.saveAnswer(questionIndex, answer);
	}

	updateOpenEndedAnswer(event: Event) {
		const input = event.target as HTMLInputElement;
		const answer = input.value.trim();
		if (answer) {
			this.questionContext!.userAnswer = [answer];
		} else {
			this.questionContext!.userAnswer = [''];
		}

		if (this.openEndedQuestionsDebounceTimer) {
			clearTimeout(this.openEndedQuestionsDebounceTimer);
		}

		this.openEndedQuestionsDebounceTimer = setTimeout(() => {
			const questionIndex = this.index;
			const userAnswer = this.questionContext!.userAnswer;
			this.saveAnswer(questionIndex, userAnswer);
		}, 5000);
	}

	async saveAnswer(questionIndex: number, answer: string[]) {
		const id = this.learningPathStudy.id;
		await lastValueFrom(this.service.answer(id, questionIndex, answer));
	}

	nextQuestion() {
		if (this.index < this.questionsContext.length - 1) {
			this.index++;
			this.questionContext = this.questionsContext[this.index];
		}
	}

	previousQuestion() {
		if (this.index > 0) {
			this.index--;
			this.questionContext = this.questionsContext[this.index];
		}
	}

	goToQuestion(i: number) {
		if (i >= 0 && i < this.questionsContext.length) {
			this.index = i;
			this.questionContext = this.questionsContext[this.index];
		}
	}

	verifyAnswer(question: Question, currentAnswers: string[]): boolean {
		const correctAnswers = question.answers;

		if (currentAnswers.length !== correctAnswers.length) {
			return false;
		}

		// TODO: Verify open-ended answers
		if (question.type === QuestionTypeEnum.OPEN_ENDED) {
			return true;
		}

		return currentAnswers.every((answer: string) => correctAnswers.includes(answer));
	}

	verifyUserAnswer(i: number): boolean {
		const userAnswers = this.questionsContext[i].userAnswer;
		return this.verifyAnswer(this.questionsContext[i].question, userAnswers);
	}

	async verifyAnswers() {
		if (this.questionsContext.some(q => q.userAnswer.length === 0)) {
			const data: ConfirmPopUpData = {
				title: 'Há questões sem resposta. Deseja verificar as respostas mesmo assim?',
				confirmButton: 'Verificar respostas',
			};
			let checkAnswers: boolean | undefined = await lastValueFrom(
				this.dialog.open(ConfirmPopUpComponent, { data }).afterClosed(),
			);
			if (!checkAnswers) {
				return;
			}
		}

		let incorrectAnswers: number[] = [];
		for (let i = 0; i < this.questionsContext.length; i++) {
			if (!this.verifyUserAnswer(i)) {
				incorrectAnswers.push(i);
			}
		}

		if (incorrectAnswers.length === 0) {
			const data: SuccessPopUpData = {
				title: 'Parabéns!',
				message: 'Você respondeu todas as questões corretamente.',
			};
			this.dialog.open(SuccessPopUpComponent, { data });
		} else {
			const data: ConfirmPopUpData = {
				title: `Você errou ${incorrectAnswers.length} ${
					incorrectAnswers.length > 1 ? 'questões' : 'questão'
				}. Gostaria de ver as respostas corretas?`,
				message: 'Confirmar irá exibir todas as respostas corretas.',
				confirmButton: 'Ver respostas',
				cancelButton: 'Tentar novamente',
			};
			this.dialog
				.open(ConfirmPopUpComponent, { data })
				.afterClosed()
				.subscribe((confirmed: boolean | undefined) => {
					this.showAnswers = !!confirmed;
					this.amountOfIncorrectAnswers = incorrectAnswers.length;
				});
		}
	}

	addMultipleChoiceQuestion() {
		this.dialog
			.open(EditMultipleChoicePopUpComponent)
			.afterClosed()
			.subscribe((result: { question: Question; index: number } | undefined) => {
				if (result) {
					this.questions.splice(result.index, 0, result.question);
				}
			});
	}

	addMultipleSelectionQuestion() {
		this.dialog
			.open(EditMultipleSelectionPopUpComponent)
			.afterClosed()
			.subscribe((result: { question: Question; index: number } | undefined) => {
				if (result) {
					this.questions.splice(result.index, 0, result.question);
				}
			});
	}

	addTrueFalseQuestion() {
		this.dialog
			.open(EditTrueFalsePopUpComponent)
			.afterClosed()
			.subscribe((result: { question: Question; index: number } | undefined) => {
				if (result) {
					this.questions.splice(result.index, 0, result.question);
				}
			});
	}

	addOpenEndedQuestion() {
		this.dialog
			.open(EditOpenEndedPopUpComponent)
			.afterClosed()
			.subscribe((result: { question: Question; index: number } | undefined) => {
				if (result) {
					this.questions.splice(result.index, 0, result.question);
				}
			});
	}

	editQuestion(index: number) {
		let editionPopUp: any;
		switch (this.questions[index].type) {
			case QuestionTypeEnum.MULTIPLE_CHOICE:
				editionPopUp = EditMultipleChoicePopUpComponent;
				break;
			case QuestionTypeEnum.MULTIPLE_SELECTION:
				editionPopUp = EditMultipleSelectionPopUpComponent;
				break;
			case QuestionTypeEnum.TRUE_FALSE:
				editionPopUp = EditTrueFalsePopUpComponent;
				break;
			case QuestionTypeEnum.OPEN_ENDED:
				editionPopUp = EditOpenEndedPopUpComponent;
				break;
		}
		this.dialog
			.open(editionPopUp, {
				data: {
					question: this.questions[index],
					index: index,
				},
			})
			.afterClosed()
			.subscribe((result: { question: Question; index: number } | undefined) => {
				if (result) {
					if (result.index === index) {
						this.questions[index] = result.question;
					} else {
						this.questions.splice(index, 1);
						this.questions.splice(result.index, 0, result.question);
					}
				}
			});
	}

	deleteQuestion(index: number) {
		const data: ConfirmPopUpData = {
			title: `Tem certeza que deseja excluir a questão ${index + 1}?`,
			message: 'Esta ação não pode ser desfeita.',
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async result => {
				if (result) {
					this.questions.splice(index, 1);
				}
			});
	}

	async save() {
		this.isLoading = true;
		await lastValueFrom(
			this.learningPathService.editQuestionLearningPath(this.learningPathStudy.learningPath.id, this.questions),
		)
			.then((learningPath: QuestionLearningPath) => {
				this.learningPathStudy.learningPath = learningPath;
				this.questions = learningPath.questions!;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
