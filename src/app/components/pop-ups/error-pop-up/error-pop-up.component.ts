import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export type ErrorPopUpData = {
	code?: number;
	message?: string;
	buttonText?: string;
};

@Component({
	selector: 'o-error-pop-up',
	imports: [],
	templateUrl: './error-pop-up.component.html',
	styleUrl: './error-pop-up.component.scss',
})
export class ErrorPopUpComponent {
	data: ErrorPopUpData = inject(MAT_DIALOG_DATA);
}
