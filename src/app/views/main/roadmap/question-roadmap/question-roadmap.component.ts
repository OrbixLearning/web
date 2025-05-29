import { Component, inject, Input } from '@angular/core';
import { Question, QuestionRoadmap } from '../../../../models/Roadmap';
import { QuestionTypeEnum } from '../../../../enums/QuestionType.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'o-question-roadmap',
	imports: [ReactiveFormsModule, MatButtonModule],
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

	ngOnInit() {
		this.question = this.roadmap.questions[this.index];
	}

	verifyAnswer() {
		if (this.form.valid) {
			const userAnswers = this.form.value.answers;
			const correctAnswers = this.question!.answers;

			if (userAnswers.length !== correctAnswers.length) {
				this.result = 'Incorrect! Please try again.';
				return;
			}

			const isCorrect = userAnswers.every((answer: string) => correctAnswers.includes(answer));

			if (isCorrect) {
				this.result = 'Correct!';
			} else {
				this.result = 'Incorrect! Please try again.';
			}
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
