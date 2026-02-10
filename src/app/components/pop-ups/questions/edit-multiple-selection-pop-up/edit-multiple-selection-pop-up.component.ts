import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuestionTypeEnum } from '../../../../enums/QuestionType.enum';
import { Question } from '../../../../models/Question';
import { Syllabus } from '../../../../models/Syllabus';
import { TextButtonComponent } from '../../../buttons/text-button/text-button.component';
import { PopUpButtonsComponent } from '../../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../../pop-up-header/pop-up-header.component';

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
	data: { question?: Question; index?: number; syllabus?: Syllabus[] } = inject(MAT_DIALOG_DATA);
	formBuilder = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<EditMultipleSelectionPopUpComponent>);

	form: FormGroup = this.formBuilder.group({
		statement: ['', Validators.required],
		options: this.formBuilder.array<string>(['', ''], Validators.required),
		answers: this.formBuilder.array<boolean>([false, false], Validators.required),
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

	get isEdit(): boolean {
		return this.data.question !== undefined;
	}

	get hasIndex(): boolean {
		return this.data.index !== undefined;
	}

	get hasSyllabus(): boolean {
		return this.data.syllabus !== undefined;
	}

	ngOnInit() {
		this.startForm();
	}

	startForm() {
		if (this.hasIndex) {
			if (this.isEdit) {
				this.form.addControl('index', this.formBuilder.control(1, Validators.min(1)));
			} else {
				this.form.addControl('index', this.formBuilder.control(this.data.index! + 1, Validators.min(1)));
			}
		}

		if (this.hasSyllabus) {
			if (this.isEdit) {
				this.form.addControl('syllabus', this.formBuilder.control([], Validators.required));
			} else {
				this.form.addControl('syllabus', this.formBuilder.control(this.data.syllabus![0], Validators.required));
			}
		}

		if (this.isEdit) {
			this.form.patchValue({
				statement: this.data.question!.statement,
			});

			this.optionsFormArray.clear();
			this.answersFormArray.clear();

			this.data.question!.options.forEach(option => {
				this.optionsFormArray.push(this.formBuilder.control<string>(option, Validators.required));
			});

			this.data.question!.options.forEach((option, index) => {
				this.answersFormArray.push(
					this.formBuilder.control<boolean>(
						this.data!.question!.answers.includes(option),
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
		this.answersFormArray.push(this.formBuilder.control<boolean>(false, Validators.required));
	}

	onSubmit() {
		if (this.form.valid) {
			const question: Question = {
				statement: this.form.value.statement!,
				options: this.form.value.options! as string[],
				answers: this.form.value.options!.filter(
					(option: string, index: number) => this.answersFormArray.at(index).value,
				) as string[],
				type: QuestionTypeEnum.MULTIPLE_SELECTION,
			};
			let response: any = question;
			if (this.hasIndex) {
				response = { question: response, index: this.form.value.index! - 1 };
			}
			if (this.hasSyllabus) {
				response = { question: response, syllabus: this.form.value.syllabus };
			}
			this.dialogRef.close(response);
		}
	}
}
