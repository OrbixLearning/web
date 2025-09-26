import { Component, EventEmitter, Input, Output, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { Classroom } from '../../models/Classroom';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { ptBR } from 'date-fns/locale';

@Component({
	selector: 'o-classroom-card',
	imports: [
    MatCardModule,
    MatIconModule
],
	templateUrl: './classroom-card.component.html',
	styleUrl: './classroom-card.component.scss',
})
export class ClassroomCardComponent {
	@Input() classroom?: Classroom;
	@Output() cardClick: EventEmitter<Classroom> = new EventEmitter<Classroom>();
	
	get modulesCount(): number {
		return this.classroom?.syllabus?.length || 0;
	}

	get studentsCount(): number {
		return this.classroom?.students?.length || 0;
	}

	get professorsCount(): number {
		return this.classroom?.teachers?.length || 0;
	}

	get lastActivity(): string {
		if (this.classroom?.updatedAt) {
		return `há ${formatDistanceToNow(new Date(this.classroom.updatedAt), { locale: ptBR })}`;
		}
		return '';
	}
}