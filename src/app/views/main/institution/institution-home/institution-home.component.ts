import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClassroomCardComponent } from '../../../../components/classroom-card/classroom-card.component';
import { Classroom } from '../../../../models/Classroom';
import { ContextService } from '../../../../services/context.service';
import { InstitutionService } from'../../../../services/institution.service';

@Component({
	selector: 'o-institution-home',
	imports: [CommonModule,ClassroomCardComponent],
	templateUrl: './institution-home.component.html',
	styleUrl: './institution-home.component.scss',
})
export class InstitutionHomeComponent {
	ctx: ContextService = inject(ContextService);
	router: Router = inject(Router);
	private institutionService: InstitutionService = inject(InstitutionService);

	goToClassroom(classroom: Classroom): void {
		this.ctx.classroom = classroom;
		this.router.navigate(['/i/' + this.ctx.classroom?.institution.id + '/c/', classroom.id]);
	}

	 get institutionLogoUrl(): string {
		const institutionId = this.ctx.institution?.id;

		return institutionId
		? this.institutionService.getLogoUrl(institutionId)
		: 'assets/logos/default-logo.png';
	}
}
