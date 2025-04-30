import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
	selector: 'o-pop-up-buttons',
	imports: [MatDialogModule, MatButtonModule],
	templateUrl: './pop-up-buttons.component.html',
	styleUrl: './pop-up-buttons.component.scss',
})
export class PopUpButtonsComponent {
	@Input() cancelButton: string = 'Cancelar';
	@Input() confirmButton: string = 'Confirmar';
	@Input() disable: boolean = false;
	@Input() type: 'button' | 'submit' | 'reset' = 'button';
	@Output() confirm: EventEmitter<void> = new EventEmitter<void>();
}
