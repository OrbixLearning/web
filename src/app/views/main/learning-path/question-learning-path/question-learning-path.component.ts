import { Component, inject, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { lastValueFrom } from 'rxjs';
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
	],
	templateUrl: './question-learning-path.component.html',
	styleUrl: './question-learning-path.component.scss',
})
export class QuestionLearningPathComponent {
	@Input() learningPathStudy!: QuestionLearningPathStudy;
	@Input() mode: 'view' | 'study' = 'view';

	formBuilder: FormBuilder = inject(FormBuilder);
	dialog: MatDialog = inject(MatDialog);
	service: LearningPathStudyService = inject(LearningPathStudyService);

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
		const questions = (this.learningPathStudy.learningPath as QuestionLearningPath).questions!;
		const userAnswers =
			(this.learningPathStudy as QuestionLearningPathStudy).userAnswers || questions.map(() => []);
		for (let i = 0; i < questions.length; i++) {
			this.questionsContext.push({
				question: questions[i],
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
		let currentAnswer = this.questionContext!.userAnswer;
		if (currentAnswer.includes(option)) {
			currentAnswer.filter((answer: string) => answer !== option);
		} else {
			currentAnswer = [...currentAnswer, option];
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

	verifyAnswer(i: number): boolean {
		const userAnswers = this.questionsContext[i].userAnswer;
		const correctAnswers = this.questionsContext[i].question.answers;

		if (userAnswers.length !== correctAnswers.length) {
			return false;
		}

		// TODO: Verify open-ended answers
		if (this.questionsContext[i].question.type === QuestionTypeEnum.OPEN_ENDED) {
			return true;
		}

		return userAnswers.every((answer: string) => correctAnswers.includes(answer));
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
			if (!this.verifyAnswer(i)) {
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
}
