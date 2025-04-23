import { Component, Input } from '@angular/core';
import { User } from '../../models/User';

@Component({
	selector: 'o-game-card',
	imports: [],
	templateUrl: './game-card.component.html',
	styleUrl: './game-card.component.scss',
})
export class GameCardComponent {
	@Input() user?: User;
}
