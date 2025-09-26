import { Component, EventEmitter, Input, Output, HostBinding } from '@angular/core';
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
	@Input() selected?: boolean;
	@Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

	@HostBinding('class.inicio-button')
	@Input()
	isHomeButton: boolean = false;

	@HostBinding('class.selected')
	get isSelected(): boolean {
		return !!this.selected;
	}
}
