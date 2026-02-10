import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuestionTypeEnum } from '../../../../enums/QuestionType.enum';
import { Question } from '../../../../models/Question';
import { PopUpButtonsComponent } from '../../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../../pop-up-header/pop-up-header.component';

@Component({
	selector: 'o-edit-open-ended-pop-up',
	imports: [PopUpHeaderComponent, PopUpButtonsComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
	templateUrl: './edit-open-ended-pop-up.component.html',
	styleUrl: './edit-open-ended-pop-up.component.scss',
})
export class EditOpenEndedPopUpComponent {
	data: { question: Question; index: number } | undefined = inject(MAT_DIALOG_DATA);
	formBuilder = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<EditOpenEndedPopUpComponent>);

	form = this.formBuilder.group({
		statement: ['', Validators.required],
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
				answer: this.data.question.answers[0],
				index: this.data.index + 1,
			});
		}
	}

	onSubmit() {
		if (this.form.valid) {
			const question: Question = {
				statement: this.form.value.statement!,
				options: [],
				answers: [this.form.value.answer!],
				type: QuestionTypeEnum.OPEN_ENDED,
			};
			this.dialogRef.close({ question, index: this.form.value.index! - 1 });
		}
	}
}
