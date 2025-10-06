import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export type ErrorPopUpData = {
	code?: number;
	message?: string;
	buttonText?: string;
};

@Component({
	selector: 'o-error-pop-up',
	imports: [MatIconModule, MatButtonModule, MatDialogModule],
	templateUrl: './error-pop-up.component.html',
	styleUrl: './error-pop-up.component.scss',
})
export class ErrorPopUpComponent {
	data: ErrorPopUpData = inject(MAT_DIALOG_DATA);
}
