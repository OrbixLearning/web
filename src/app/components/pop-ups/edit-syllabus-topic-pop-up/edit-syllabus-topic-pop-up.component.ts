import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

@Component({
	selector: 'o-edit-syllabus-topic-pop-up',
	imports: [ReactiveFormsModule, PopUpButtonsComponent, PopUpHeaderComponent, MatFormFieldModule, MatInputModule],
	templateUrl: './edit-syllabus-topic-pop-up.component.html',
	styleUrl: './edit-syllabus-topic-pop-up.component.scss',
})
export class EditSyllabusTopicPopUpComponent {
	data: string = inject(MAT_DIALOG_DATA);
	dialogRef: MatDialogRef<EditSyllabusTopicPopUpComponent> = inject(MatDialogRef<EditSyllabusTopicPopUpComponent>);
	formBuilder: FormBuilder = inject(FormBuilder);

	form = this.formBuilder.group({
		name: [this.data, Validators.required],
	});

	onSubmit() {
		if (this.form.valid) {
			this.dialogRef.close(this.form.get('name')?.value);
		}
	}
}
