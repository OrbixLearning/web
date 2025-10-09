import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Question } from '../../../../../models/LearningPath/Question';
import { PopUpHeaderComponent } from '../../../../../components/pop-ups/pop-up-header/pop-up-header.component';
import { PopUpButtonsComponent } from '../../../../../components/pop-ups/pop-up-buttons/pop-up-buttons.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuestionTypeEnum } from '../../../../../enums/QuestionType.enum';

@Component({
	selector: 'o-edit-multiple-choice-pop-up',
	imports: [PopUpHeaderComponent, PopUpButtonsComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
	templateUrl: './edit-multiple-choice-pop-up.component.html',
	styleUrl: './edit-multiple-choice-pop-up.component.scss',
})
export class EditMultipleChoicePopUpComponent {
	data: { question: Question; index: number } | undefined = inject(MAT_DIALOG_DATA);
	formBuilder = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<EditMultipleChoicePopUpComponent>);

	form = this.formBuilder.group({
		statement: ['', Validators.required],
		options: this.formBuilder.control<string[]>([], Validators.required),
		answer: ['', Validators.required],
		index: [1, Validators.min(1)],
	});

	ngOnInit() {
		this.startForm();
	}

	startForm() {
		if (this.data) {
			this.form.patchValue({
				statement: this.data.question.statement,
				options: this.data.question.options,
				answer: this.data.question.answers[0],
				index: this.data.index + 1,
			});
		}
	}

	onSubmit() {
		if (this.form.valid) {
			const question: Question = {
				statement: this.form.value.statement!,
				options: this.form.value.options! as string[],
				answers: [this.form.value.answer!],
				type: QuestionTypeEnum.MULTIPLE_CHOICE,
			};
			this.dialogRef.close({ question, index: this.form.value.index! - 1 });
		}
	}
}
