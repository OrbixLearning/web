import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'o-pop-up-header',
	imports: [MatDialogModule, MatIconModule, MatButtonModule],
	templateUrl: './pop-up-header.component.html',
	styleUrl: './pop-up-header.component.scss',
})
export class PopUpHeaderComponent {
	@Input() title?: string;
}
