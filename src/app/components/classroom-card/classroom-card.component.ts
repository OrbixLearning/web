import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Classroom } from '../../models/Classroom';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'o-classroom-card',
	imports: [MatCardModule, MatIconModule],
	templateUrl: './classroom-card.component.html',
	styleUrl: './classroom-card.component.scss',
})
export class ClassroomCardComponent {
	@Input() classroom?: Classroom;
	@Output() cardClick: EventEmitter<Classroom> = new EventEmitter<Classroom>();
}
