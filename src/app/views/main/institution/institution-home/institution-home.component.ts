import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClassroomCardComponent } from '../../../../components/classroom-card/classroom-card.component';
import { Classroom } from '../../../../models/Classroom';
import { ContextService } from '../../../../services/context.service';

@Component({
	selector: 'o-institution-home',
	imports: [ClassroomCardComponent],
	templateUrl: './institution-home.component.html',
	styleUrl: './institution-home.component.scss',
})
export class InstitutionHomeComponent {
	ctx: ContextService = inject(ContextService);
	router: Router = inject(Router);

	get sortedClassrooms(): Classroom[] {
		return this.ctx.classroomList?.sort((a, b) => a.name.localeCompare(b.name)) || [];
	}

	goToClassroom(classroom: Classroom) {
		this.ctx.classroom = classroom;
		this.router.navigate(['/i/' + this.ctx.classroom?.institution.id + '/c/', classroom.id]);
	}
}
