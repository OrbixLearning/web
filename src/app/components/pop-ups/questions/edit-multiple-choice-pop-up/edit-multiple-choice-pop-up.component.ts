import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { QuestionTypeEnum } from '../../../../enums/QuestionType.enum';
import { Question } from '../../../../models/Question';
import { Syllabus } from '../../../../models/Syllabus';
import { TextButtonComponent } from '../../../buttons/text-button/text-button.component';
import { PopUpButtonsComponent } from '../../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../../pop-up-header/pop-up-header.component';

@Component({
	selector: 'o-edit-multiple-choice-pop-up',
	imports: [
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		MatIconModule,
		MatButtonModule,
		TextButtonComponent,
	],
	templateUrl: './edit-multiple-choice-pop-up.component.html',
	styleUrl: './edit-multiple-choice-pop-up.component.scss',
})
export class EditMultipleChoicePopUpComponent {
	data: { question?: Question; index?: number; syllabus?: Syllabus[] } = inject(MAT_DIALOG_DATA);
	formBuilder = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<EditMultipleChoicePopUpComponent>);

	form: FormGroup = this.formBuilder.group({
		statement: ['', Validators.required],
		options: this.formBuilder.array<string>(['', ''], Validators.required),
		answer: this.formBuilder.control<number | undefined>(undefined, Validators.required),
	});

	get optionsFormArray(): FormArray {
		return this.form.get('options') as FormArray;
	}

	get optionsFormControls(): FormControl[] {
		return this.optionsFormArray.controls as FormControl[];
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
				answer: this.data.question!.options.indexOf(this.data.question!.answers[0]),
			});
			this.optionsFormArray.clear();
			this.data.question!.options.forEach(option => {
				this.optionsFormArray.push(this.formBuilder.control<string>(option, Validators.required));
			});
		}
	}

	selectAnswer(index: number) {
		this.form.patchValue({ answer: index });
	}

	deleteOption(index: number) {
		this.optionsFormArray.removeAt(index);
		if (this.form.value.answer !== undefined && this.form.value.answer! >= index) {
			this.form.patchValue({ answer: undefined });
		}
	}

	addOption() {
		this.optionsFormArray.push(this.formBuilder.control<string>('', Validators.required));
	}

	onSubmit() {
		if (this.form.valid) {
			const question: Question = {
				statement: this.form.value.statement!,
				options: this.form.value.options! as string[],
				answers: [this.form.value.options![this.form.value.answer!] as string],
				type: QuestionTypeEnum.MULTIPLE_CHOICE,
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
