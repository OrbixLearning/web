import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Syllabus } from '../../../models/Syllabus';
import { SyllabusComponent } from '../../syllabus/syllabus.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

export type SyllabusPresetCreationPopUpData = {
	syllabus: Syllabus[];
};

export type SyllabusPresetCreationPopUpResult = {
	name: string;
	syllabus: Syllabus[];
};

@Component({
	selector: 'o-syllabus-preset-creation-pop-up',
	imports: [
		SyllabusComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		PopUpHeaderComponent,
		PopUpButtonsComponent,
	],
	templateUrl: './syllabus-preset-creation-pop-up.component.html',
	styleUrl: './syllabus-preset-creation-pop-up.component.scss',
})
export class SyllabusPresetCreationPopUpComponent {
	data: SyllabusPresetCreationPopUpData = inject(MAT_DIALOG_DATA);
	formBuilder: FormBuilder = inject(FormBuilder);
	dialogRef: MatDialogRef<SyllabusPresetCreationPopUpComponent> = inject(
		MatDialogRef<SyllabusPresetCreationPopUpComponent>,
	);

	form: FormGroup = this.formBuilder.group({
		name: ['', Validators.required],
		syllabus: this.formBuilder.control<Syllabus[] | undefined>(undefined),
	});

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	markSyllabus(syllabus: Syllabus[]) {
		this.getFormControl('syllabus').setValue(syllabus);
	}

	onSubmit() {
		if (this.form.valid) {
			const result: SyllabusPresetCreationPopUpResult = {
				name: this.getFormControl('name').value,
				syllabus: this.getFormControl('syllabus').value || [],
			};
			this.dialogRef.close(result);
		}
	}
}
