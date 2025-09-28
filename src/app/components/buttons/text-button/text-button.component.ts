import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'o-text-button',
	imports: [MatButtonModule, MatIconModule],
	templateUrl: './text-button.component.html',
	styleUrl: './text-button.component.scss',
})
export class TextButtonComponent {
	@Input() icon?: string;
	@Input() disabled: boolean = false;
	@Input() type: 'button' | 'submit' | 'reset' = 'button';
	@Output() onclick: EventEmitter<void> = new EventEmitter<void>();
}
