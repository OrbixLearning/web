import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'o-sidebar-button',
	imports: [MatButtonModule, MatIconModule],
	templateUrl: './sidebar-button.component.html',
	styleUrl: './sidebar-button.component.scss',
})
export class SidebarButtonComponent {
	@Input() icon?: string | null;
	@Input() text?: string;
	@Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
}
