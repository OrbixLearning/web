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
import { QuestionTypePipe } from '../../../../pipes/question-type.pipe';
import { ContextService } from '../../../../services/context.service';
import { LearningPathStudyService } from '../../../../services/learning-path-study.service';
import { LearningPathService } from '../../../../services/learning-path.service';
import { EditMultipleChoicePopUpComponent } from './edit-multiple-choice-pop-up/edit-multiple-choice-pop-up.component';
import { EditMultipleSelectionPopUpComponent } from './edit-multiple-selection-pop-up/edit-multiple-selection-pop-up.component';
import { EditOpenEndedPopUpComponent } from './edit-open-ended-pop-up/edit-open-ended-pop-up.component';
import { EditTrueFalsePopUpComponent } from './edit-true-false-pop-up/edit-true-false-pop-up.component';

type QuestionContext = {
	question: Question;
	userAnswer: string[];
	showAnswer: boolean;
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
		QuestionTypePipe,
	],
	templateUrl: './question-learning-path.component.html',
	styleUrl: './question-learning-path.component.scss',
})
export class QuestionLearningPathComponent {
	formBuilder: FormBuilder = inject(FormBuilder);
	dialog: MatDialog = inject(MatDialog);
	service: LearningPathStudyService = inject(LearningPathStudyService);
	learningPathService: LearningPathService = inject(LearningPathService);
	ctx: ContextService = inject(ContextService);

	@Input() mode: 'edit' | 'study' = 'edit';

	isLoading: boolean = false;
	questions: Question[] = [];
	questionsContext: QuestionContext[] = [];
	questionContext?: QuestionContext;
	index: number = 0;
	amountOfIncorrectAnswers: number = 0;
	questionTypeEnum = QuestionTypeEnum;
	openEndedQuestionsDebounceTimer: any;

	readonly QUESTION_TYPES = Object.values(QuestionTypeEnum) as QuestionTypeEnum[];

	get question(): Question | undefined {
		return this.questionContext?.question;
	}

	get userAnswer(): string[] {
		return this.questionContext?.userAnswer || [];
	}

	get currentQuestionAnswerFormatted(): string {
		switch (this.question?.type) {
			case QuestionTypeEnum.TRUE_FALSE:
				return this.question?.answers[0] === 'true' ? 'Verdadeiro' : 'Falso';
			default:
				return this.question?.answers.join(', ') || '';
		}
	}

	get hasAnyAnswer(): boolean {
		return this.questionsContext.some(q => q.userAnswer.length > 0);
	}

	get allAnswersShowed(): boolean {
		return this.questionsContext.every(qc => qc.showAnswer);
	}

	ngOnInit() {
		this.resetData();
		this.startData();
	}

	resetData() {
		this.index = 0;
		this.amountOfIncorrectAnswers = 0;
	}

	startData() {
		this.questions = (this.ctx.learningPathStudy!.learningPath as QuestionLearningPath).questions!;
		const userAnswers =
			(this.ctx.learningPathStudy! as QuestionLearningPathStudy).userAnswers || this.questions.map(() => []);
		this.questionsContext = [];
		for (let i = 0; i < this.questions.length; i++) {
			this.questionsContext.push({
				question: this.questions[i],
				userAnswer: userAnswers[i].answer || [],
				showAnswer: false,
			});
		}
		this.questionContext = this.questionsContext[this.index];
	}

	markSingle(option: string) {
		// Since mat-button-toggle-group triggers change events twice when clicking the same option,
		// we need to check if the selected option is already the user answer  or if option is undefined
		// to avoid unnecessary calls.
		if (
			this.questionContext!.question.type === QuestionTypeEnum.TRUE_FALSE &&
			(this.questionContext!.userAnswer[0] === option || !option)
		) {
			return;
		}

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
		const id = this.ctx.learningPathStudy!.id;
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

	hideAllAnswers() {
		this.questionsContext.forEach(qc => {
			qc.showAnswer = false;
		});
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

	async showAnswer() {
		if (this.questionContext?.showAnswer) {
			this.questionContext.showAnswer = false;
		} else {
			if (this.questionContext?.userAnswer.length === 0) {
				const data: ConfirmPopUpData = {
					title: 'Esta questão não foi respondida. Deseja ver a resposta correta mesmo assim?',
					confirmButton: 'Ver resposta',
				};
				let checkAnswers: boolean | undefined = await lastValueFrom(
					this.dialog.open(ConfirmPopUpComponent, { data }).afterClosed(),
				);
				if (!checkAnswers) {
					return;
				}
			}
			this.questionContext!.showAnswer = true;
		}
	}

	async showAnswers() {
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
					this.questionsContext.forEach(qc => {
						qc.showAnswer = !!confirmed;
					});
					this.amountOfIncorrectAnswers = incorrectAnswers.length;
				});
		}
	}

	async clearAnswers() {
		const data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja limpar todas as respostas?',
			message: 'Esta ação não pode ser desfeita.',
			confirmButton: 'Limpar respostas',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (result: boolean | undefined) => {
				if (result) {
					this.isLoading = true;
					await lastValueFrom(this.service.clearAnswers(this.ctx.learningPathStudy!.id))
						.then((lps: QuestionLearningPathStudy) => {
							this.ctx.learningPathStudy! = lps;
							this.resetData();
							this.startData();
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	addQuestion(type: QuestionTypeEnum) {
		switch (type) {
			case QuestionTypeEnum.MULTIPLE_CHOICE:
				this.addMultipleChoiceQuestion();
				break;
			case QuestionTypeEnum.MULTIPLE_SELECTION:
				this.addMultipleSelectionQuestion();
				break;
			case QuestionTypeEnum.TRUE_FALSE:
				this.addTrueFalseQuestion();
				break;
			case QuestionTypeEnum.OPEN_ENDED:
				this.addOpenEndedQuestion();
				break;
		}
	}

	addMultipleChoiceQuestion() {
		this.dialog
			.open(EditMultipleChoicePopUpComponent, {
				minWidth: '600px',
			})
			.afterClosed()
			.subscribe((result: { question: Question; index: number } | undefined) => {
				if (result) {
					this.questions.splice(result.index, 0, result.question);
				}
			});
	}

	addMultipleSelectionQuestion() {
		this.dialog
			.open(EditMultipleSelectionPopUpComponent, {
				minWidth: '600px',
			})
			.afterClosed()
			.subscribe((result: { question: Question; index: number } | undefined) => {
				if (result) {
					this.questions.splice(result.index, 0, result.question);
				}
			});
	}

	addTrueFalseQuestion() {
		this.dialog
			.open(EditTrueFalsePopUpComponent, {
				minWidth: '600px',
			})
			.afterClosed()
			.subscribe((result: { question: Question; index: number } | undefined) => {
				if (result) {
					this.questions.splice(result.index, 0, result.question);
				}
			});
	}

	addOpenEndedQuestion() {
		this.dialog
			.open(EditOpenEndedPopUpComponent, {
				minWidth: '600px',
			})
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
				minWidth: '600px',
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
			this.learningPathService.editQuestionLearningPath(
				this.ctx.learningPathStudy!.learningPath.id,
				this.questions,
			),
		)
			.then((learningPath: QuestionLearningPath) => {
				this.ctx.learningPathStudy!.learningPath = learningPath;
				this.questions = learningPath.questions!;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	reset() {
		this.resetData();
		this.startData();
	}
}
