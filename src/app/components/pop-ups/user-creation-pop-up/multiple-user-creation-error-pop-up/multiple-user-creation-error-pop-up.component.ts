import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'o-multiple-user-creation-error-pop-up',
	imports: [MatDialogModule, MatIconModule, MatButtonModule],
	templateUrl: './multiple-user-creation-error-pop-up.component.html',
	styleUrl: './multiple-user-creation-error-pop-up.component.scss',
})
export class MultipleUserCreationErrorPopUpComponent {
	data: { message: string; problematicUsers?: string[] } = inject(MAT_DIALOG_DATA);
}
