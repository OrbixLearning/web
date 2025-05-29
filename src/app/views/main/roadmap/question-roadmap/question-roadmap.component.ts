import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { QuestionTypeEnum } from '../../../../enums/QuestionType.enum';
import { Question, QuestionRoadmap } from '../../../../models/Roadmap';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	selector: 'o-question-roadmap',
	imports: [
		ReactiveFormsModule,
		MatButtonModule,
		MatRadioModule,
		MatCheckboxModule,
		MatButtonToggleModule,
		MatFormFieldModule,
		MatInputModule,
	],
	templateUrl: './question-roadmap.component.html',
	styleUrl: './question-roadmap.component.scss',
})
export class QuestionRoadmapComponent {
	@Input() roadmap!: QuestionRoadmap;

	formBuilder: FormBuilder = inject(FormBuilder);

	index: number = 0;
	question?: Question;
	questionTypeEnum = QuestionTypeEnum;
	form: FormGroup = this.formBuilder.group({
		answers: this.formBuilder.control<string[]>([], Validators.required),
	});
	result?: string;

	get answersControl(): FormControl {
		return this.form.get('answers') as FormControl;
	}

	ngOnInit() {
		this.question = this.roadmap.questions[this.index];
	}

	markedCheckbox(option: string) {
		const currentAnswers = this.form.value.answers || [];
		if (currentAnswers.includes(option)) {
			this.form.patchValue({
				answers: currentAnswers.filter((answer: string) => answer !== option),
			});
		} else {
			this.form.patchValue({
				answers: [...currentAnswers, option],
			});
		}
	}

	updateOpenEndedAnswer(event: Event) {
		const input = event.target as HTMLInputElement;
		const answer = input.value.trim();
		if (answer) {
			this.form.patchValue({
				answers: [answer],
			});
		} else {
			this.form.patchValue({
				answers: [''],
			});
		}
	}

	verifyAnswer() {
		if (this.form.valid) {
			const userAnswers = this.form.value.answers;
			const correctAnswers = this.question!.answers;

			if (userAnswers.length !== correctAnswers.length) {
				this.result = 'Errado!';
				return;
			}

			const isCorrect = userAnswers.every((answer: string) => correctAnswers.includes(answer));

			this.result = isCorrect ? 'Acertou!' : 'Errado!';
		}
	}

	nextQuestion() {
		if (this.index < this.roadmap.questions.length - 1) {
			this.form.reset();
			this.result = undefined;
			this.index++;
			this.question = this.roadmap.questions[this.index];
		}
	}

	previousQuestion() {
		if (this.index > 0) {
			this.form.reset();
			this.result = undefined;
			this.index--;
			this.question = this.roadmap.questions[this.index];
		}
	}
}
