import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'o-sidebar-button',
	imports: [MatButtonModule, MatIconModule, RouterModule],
	templateUrl: './sidebar-button.component.html',
	styleUrl: './sidebar-button.component.scss',
})
export class SidebarButtonComponent {
	@Input() icon?: string | null;
	@Input() text?: string;
	@Input() url?: string;
}
