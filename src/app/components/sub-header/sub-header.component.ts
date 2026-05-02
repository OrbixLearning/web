import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SetupTutorial } from '../../views/main/classroom/classroom-setup/classroom-setup.component';
import { HighlightButtonComponent } from '../buttons/highlight-button/highlight-button.component';
import { TextButtonComponent } from '../buttons/text-button/text-button.component';

export type SubHeaderButton = {
	text: string;
	function: () => void;
	icon?: string;
	highlighted?: boolean;
	disabled?: boolean;
};

@Component({
	selector: 'o-sub-header',
	imports: [MatButtonModule, MatIconModule, RouterModule, HighlightButtonComponent, TextButtonComponent],
	templateUrl: './sub-header.component.html',
	styleUrl: './sub-header.component.scss',
})
export class SubHeaderComponent {
	@Input() backButtonLink?: string;
	@Input() setup?: SetupTutorial;
	@Input() buttons: SubHeaderButton[] = [];
}
