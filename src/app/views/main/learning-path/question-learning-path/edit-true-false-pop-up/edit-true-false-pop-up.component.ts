import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PopUpButtonsComponent } from '../../../../../components/pop-ups/pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../../../../../components/pop-ups/pop-up-header/pop-up-header.component';
import { QuestionTypeEnum } from '../../../../../enums/QuestionType.enum';
import { Question } from '../../../../../models/LearningPath/Question';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
	selector: 'o-edit-true-false-pop-up',
	imports: [
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonToggleModule,
	],
	templateUrl: './edit-true-false-pop-up.component.html',
	styleUrl: './edit-true-false-pop-up.component.scss',
})
export class EditTrueFalsePopUpComponent {
	data: { question: Question; index: number } | undefined = inject(MAT_DIALOG_DATA);
	formBuilder = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<EditTrueFalsePopUpComponent>);

	form = this.formBuilder.group({
		statement: ['', Validators.required],
		answer: this.formBuilder.control<boolean | undefined>(undefined, Validators.required),
		index: [1, Validators.min(1)],
	});

	ngOnInit() {
		this.startForm();
	}

	startForm() {
		if (this.data) {
			this.form.patchValue({
				statement: this.data.question.statement,
				answer: this.data.question.answers[0] === 'true',
				index: this.data.index + 1,
			});
		}
	}

	onSubmit() {
		if (this.form.valid) {
			const question: Question = {
				statement: this.form.value.statement!,
				options: ['true', 'false'],
				answers: [this.form.value.answer! ? 'true' : 'false'],
				type: QuestionTypeEnum.TRUE_FALSE,
			};
			this.dialogRef.close({ question, index: this.form.value.index! - 1 });
		}
	}
}
