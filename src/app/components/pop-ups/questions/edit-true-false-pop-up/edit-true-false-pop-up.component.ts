import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuestionTypeEnum } from '../../../../enums/QuestionType.enum';
import { Question } from '../../../../models/Question';
import { Syllabus } from '../../../../models/Syllabus';
import { ContextService } from '../../../../services/context.service';
import { SyllabusComponent } from '../../../syllabus/syllabus.component';
import { PopUpButtonsComponent } from '../../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../../pop-up-header/pop-up-header.component';

@Component({
	selector: 'o-edit-true-false-pop-up',
	imports: [
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonToggleModule,
		SyllabusComponent,
	],
	templateUrl: './edit-true-false-pop-up.component.html',
	styleUrl: './edit-true-false-pop-up.component.scss',
})
export class EditTrueFalsePopUpComponent {
	data: { question?: Question; index?: number; syllabus?: Syllabus[] } = inject(MAT_DIALOG_DATA);
	formBuilder = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<EditTrueFalsePopUpComponent>);
	ctx: ContextService = inject(ContextService);

	form: FormGroup = this.formBuilder.group({
		statement: ['', Validators.required],
		answer: this.formBuilder.control<boolean | undefined>(undefined, Validators.required),
	});

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
			this.form.addControl('index', this.formBuilder.control(this.data.index! + 1, Validators.min(1)));
		}

		if (this.hasSyllabus) {
			if (this.isEdit) {
				this.form.addControl('syllabus', this.formBuilder.control(this.data.syllabus!, Validators.required));
			} else {
				this.form.addControl('syllabus', this.formBuilder.control([], Validators.required));
			}
		}

		if (this.isEdit) {
			this.form.patchValue({
				statement: this.data.question!.statement,
				answer: this.data.question!.answers[0] === 'true',
			});
		}
	}

	markSyllabus(syllabus: Syllabus[]) {
		this.form.patchValue({ syllabus });
	}

	onSubmit() {
		if (this.form.valid) {
			const question: Question = {
				statement: this.form.value.statement!,
				options: ['true', 'false'],
				answers: [this.form.value.answer! ? 'true' : 'false'],
				type: QuestionTypeEnum.TRUE_FALSE,
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
