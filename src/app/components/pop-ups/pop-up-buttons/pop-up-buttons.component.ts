import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TextButtonComponent } from '../../buttons/text-button/text-button.component';
import { HighlightButtonComponent } from "../../buttons/highlight-button/highlight-button.component";

@Component({
	selector: 'o-pop-up-buttons',
	imports: [MatDialogModule, MatButtonModule, TextButtonComponent, HighlightButtonComponent],
	templateUrl: './pop-up-buttons.component.html',
	styleUrl: './pop-up-buttons.component.scss',
})
export class PopUpButtonsComponent {
	@Input() cancelButton: string = 'Cancelar';
	@Input() confirmButton: string = 'Confirmar';
	@Input() disable: boolean = false;
	@Input() type: 'button' | 'submit' | 'reset' = 'button';
	@Output() confirm: EventEmitter<void> = new EventEmitter<void>();

	dialogRef: MatDialogRef<PopUpButtonsComponent> = inject(MatDialogRef<PopUpButtonsComponent>);
}
