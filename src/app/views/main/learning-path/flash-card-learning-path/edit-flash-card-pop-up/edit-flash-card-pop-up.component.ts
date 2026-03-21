import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PopUpButtonsComponent } from '../../../../../components/pop-ups/pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../../../../../components/pop-ups/pop-up-header/pop-up-header.component';
import { FlashCard } from '../../../../../models/LearningPath/FlashCard';
import { MarkdownEditorComponent } from '../../../../../components/markdown-editor/markdown-editor.component';

@Component({
	selector: 'o-edit-flash-card-pop-up',
	imports: [
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MarkdownEditorComponent,
	],
	templateUrl: './edit-flash-card-pop-up.component.html',
	styleUrl: './edit-flash-card-pop-up.component.scss',
})
export class EditFlashCardPopUpComponent {
	data: FlashCard | undefined = inject(MAT_DIALOG_DATA);
	formBuilder = inject(FormBuilder);
	dialogRef = inject(MatDialogRef<EditFlashCardPopUpComponent>);

	form = this.formBuilder.group({
		front: ['', Validators.required],
		back: ['', Validators.required],
	});

	ngOnInit() {
		this.startForm();
	}

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	startForm() {
		if (this.data) {
			this.form.patchValue({
				front: this.data.front,
				back: this.data.back,
			});
		}
	}

	onSubmit() {
		if (this.form.valid) {
			const flashcard: FlashCard = {
				front: this.form.value.front || '',
				back: this.form.value.back || '',
			};
			this.dialogRef.close(flashcard);
		}
	}
}
