import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'o-highlight-button',
	imports: [MatButtonModule, MatIconModule],
	templateUrl: './highlight-button.component.html',
	styleUrl: './highlight-button.component.scss',
})
export class HighlightButtonComponent {
	@Input() icon?: string;
	@Input() disabled: boolean = false;
	@Input() type: 'button' | 'submit' | 'reset' = 'button';
	@Output() onclick: EventEmitter<void> = new EventEmitter<void>();
}
