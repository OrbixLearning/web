import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { QuestionTypeEnum } from '../../../../enums/QuestionType.enum';
import { Question } from '../../../../models/Question';
import { Syllabus } from '../../../../models/Syllabus';
import { PopUpButtonsComponent } from '../../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../../pop-up-header/pop-up-header.component';
import { ContextService } from '../../../../services/context.service';
import { SyllabusComponent } from "../../../syllabus/syllabus.component";

@Component({
	selector: 'o-edit-open-ended-pop-up',
	imports: [PopUpHeaderComponent, PopUpButtonsComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, SyllabusComponent],
	templateUrl: './edit-open-ended-pop-up.component.html',
	styleUrl: './edit-open-ended-pop-up.component.scss',
})
export class EditOpenEndedPopUpComponent {
	data: { question?: Question; index?: number; syllabus?: Syllabus[] } = inject(MAT_DIALOG_DATA);
	formBuilder = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<EditOpenEndedPopUpComponent>);
    ctx: ContextService = inject(ContextService);

	form: FormGroup = this.formBuilder.group({
		statement: ['', Validators.required],
		answer: ['', Validators.required],
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
				this.form.addControl('syllabus', this.formBuilder.control(this.data.syllabus!, Validators.required));
			}
		}

		if (this.isEdit) {
			this.form.patchValue({
				statement: this.data.question!.statement,
				answer: this.data.question!.answers[0],
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
				options: [],
				answers: [this.form.value.answer!],
				type: QuestionTypeEnum.OPEN_ENDED,
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
