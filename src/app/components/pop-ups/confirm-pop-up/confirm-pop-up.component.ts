import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { MatIconModule } from "@angular/material/icon";

export type ConfirmPopUpData = {
	title?: string;
	message?: string;
	confirmButton?: string;
	cancelButton?: string;
};

@Component({
	selector: 'o-confirm-pop-up',
	imports: [MatDialogModule, PopUpButtonsComponent, MatIconModule],
	templateUrl: './confirm-pop-up.component.html',
	styleUrl: './confirm-pop-up.component.scss',
})
export class ConfirmPopUpComponent {
	data: ConfirmPopUpData = inject(MAT_DIALOG_DATA);
	dialogRef: MatDialogRef<ConfirmPopUpComponent> = inject(MatDialogRef<ConfirmPopUpComponent>);
}
