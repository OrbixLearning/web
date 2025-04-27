import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export type SuccessPopUpData = {
	title?: string;
	message?: string;
	buttonText?: string;
};

@Component({
	selector: 'o-success-pop-up',
	imports: [MatButtonModule, MatDialogModule],
	templateUrl: './success-pop-up.component.html',
	styleUrl: './success-pop-up.component.scss',
})
export class SuccessPopUpComponent {
	data: SuccessPopUpData = inject(MAT_DIALOG_DATA);
}
