import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TextButtonComponent } from '../../../../../components/buttons/text-button/text-button.component';
import { PopUpButtonsComponent } from '../../../../../components/pop-ups/pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../../../../../components/pop-ups/pop-up-header/pop-up-header.component';
import { QuestionTypeEnum } from '../../../../../enums/QuestionType.enum';
import { Question } from '../../../../../models/LearningPath/Question';

@Component({
	selector: 'o-edit-multiple-selection-pop-up',
	imports: [
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		TextButtonComponent,
		MatCheckboxModule,
		MatIconModule,
		MatButtonModule,
	],
	templateUrl: './edit-multiple-selection-pop-up.component.html',
	styleUrl: './edit-multiple-selection-pop-up.component.scss',
})
export class EditMultipleSelectionPopUpComponent {
	data: { question: Question; index: number } | undefined = inject(MAT_DIALOG_DATA);
	formBuilder = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<EditMultipleSelectionPopUpComponent>);

	form = this.formBuilder.group({
		statement: ['', Validators.required],
		options: this.formBuilder.array<string>(['', ''], Validators.required),
		answers: this.formBuilder.array<boolean>([false, false], Validators.required),
		index: [1, Validators.min(1)],
	});

	get optionsFormArray(): FormArray {
		return this.form.get('options') as FormArray;
	}

	get optionsFormControls(): FormControl[] {
		return this.optionsFormArray.controls as FormControl[];
	}

	get answersFormArray(): FormArray {
		return this.form.get('answers') as FormArray;
	}

	get answersFormControls(): FormControl[] {
		return this.answersFormArray.controls as FormControl[];
	}

	ngOnInit() {
		this.startForm();
	}

	startForm() {
		if (this.data) {
			this.form.patchValue({
				statement: this.data.question.statement,
				index: this.data.index + 1,
			});

			this.optionsFormArray.clear();
			this.answersFormArray.clear();

			this.data.question.options.forEach(option => {
				this.optionsFormArray.push(this.formBuilder.control<string>(option, Validators.required));
			});

			this.data.question.options.forEach((option, index) => {
				this.answersFormArray.push(
					this.formBuilder.control<boolean>(
						this.data!.question.answers.includes(option),
						Validators.required,
					),
				);
			});
		}
	}

	selectAnswer(index: number) {
		const currentValue = this.answersFormArray.at(index).value;
		this.answersFormArray.at(index).setValue(!currentValue);
	}

	deleteOption(index: number) {
		this.optionsFormArray.removeAt(index);
		this.answersFormArray.removeAt(index);
	}

	addOption() {
		this.optionsFormArray.push(this.formBuilder.control<string>('', Validators.required));
	}

	onSubmit() {
		if (this.form.valid) {
			const question: Question = {
				statement: this.form.value.statement!,
				options: this.form.value.options! as string[],
				answers: this.form.value.options!.filter(
					(option, index) => this.answersFormArray.at(index).value,
				) as string[],
				type: QuestionTypeEnum.MULTIPLE_SELECTION,
			};
			this.dialogRef.close({ question, index: this.form.value.index! - 1 });
		}
	}
}
