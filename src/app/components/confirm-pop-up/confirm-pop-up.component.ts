import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export type ConfirmPopUpData = {
	title?: string;
	message?: string;
	confirmButton?: string;
	cancelButton?: string;
};

@Component({
	selector: 'o-confirm-pop-up',
	imports: [MatButtonModule, MatDialogModule],
	templateUrl: './confirm-pop-up.component.html',
	styleUrl: './confirm-pop-up.component.scss',
})
export class ConfirmPopUpComponent {
	data: ConfirmPopUpData = inject(MAT_DIALOG_DATA);
}
