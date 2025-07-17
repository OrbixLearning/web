import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

@Component({
	selector: 'o-edit-syllabus-topic-pop-up',
	imports: [FormsModule, PopUpButtonsComponent, PopUpHeaderComponent, MatFormFieldModule, MatInputModule],
	templateUrl: './edit-syllabus-topic-pop-up.component.html',
	styleUrl: './edit-syllabus-topic-pop-up.component.scss',
})
export class EditSyllabusTopicPopUpComponent {
	data: string = inject(MAT_DIALOG_DATA);
	dialogRef: MatDialogRef<EditSyllabusTopicPopUpComponent> = inject(MatDialogRef<EditSyllabusTopicPopUpComponent>);

	name: string = this.data;

	confirm() {
		if (this.name && this.name.length > 0) {
			this.dialogRef.close(this.name);
		}
	}
}
