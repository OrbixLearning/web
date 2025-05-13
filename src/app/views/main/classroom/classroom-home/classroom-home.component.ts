import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { lastValueFrom } from 'rxjs';
import { RoadmapCreationPopUpComponent } from '../../../../components/pop-ups/roadmap-creation-pop-up/roadmap-creation-pop-up.component';
import { RoadmapCardComponent } from '../../../../components/roadmap-card/roadmap-card.component';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { InstitutionRoleEnum } from '../../../../enums/InstitutionRole.enum';
import { Roadmap } from '../../../../models/Roadmap';
import { ContextService } from '../../../../services/context.service';
import { RoadmapService } from '../../../../services/roadmap.service';

@Component({
	selector: 'o-classroom-home',
	imports: [
		MatIconModule,
		MatButtonModule,
		RouterModule,
		DividerModule,
		MatFormFieldModule,
		MatInputModule,
		SyllabusComponent,
		RoadmapCardComponent,
	],
	templateUrl: './classroom-home.component.html',
	styleUrl: './classroom-home.component.scss',
})
export class ClassroomHomeComponent {
	ctx: ContextService = inject(ContextService);
	roadmapService: RoadmapService = inject(RoadmapService);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = true;
	myRoadmaps: Roadmap[] = [];
	sharedRoadmaps: Roadmap[] = [];

	ngOnInit() {
		this.getData();
	}

	get baseUrl(): string {
		return '/i/' + this.ctx.institution?.id + '/c/' + this.ctx.classroom?.id;
	}

	get teacherRoadmaps(): Roadmap[] {
		return this.sharedRoadmaps.filter(roadmap => !this.studentRoadmaps.includes(roadmap));
	}

	get studentRoadmaps(): Roadmap[] {
		return this.sharedRoadmaps.filter(roadmap => roadmap.userInstitutionRole === InstitutionRoleEnum.STUDENT);
	}

	async getData() {
		this.isLoading = true;
		Promise.all([
			lastValueFrom(this.roadmapService.getUserRoadmapsByInstitution(this.ctx.institution?.id!)),
			lastValueFrom(this.roadmapService.getClassroomSharedRoadmaps(this.ctx.classroom?.id!)),
		])
			.then(res => {
				this.myRoadmaps = res[0];
				this.sharedRoadmaps = res[1];
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	createRoadmap() {
		this.dialog
			.open(RoadmapCreationPopUpComponent, {
				disableClose: true,
				maxWidth: '1800px',
			})
			.afterClosed()
			.subscribe((res: Roadmap | undefined) => {
				if (res) {
					this.myRoadmaps = [res, ...this.myRoadmaps];
					this.goToRoadmap(res);
				}
			});
	}

	goToRoadmap(roadmap: Roadmap) {
		console.log('goto');
	}

	updatedRoadmapSharing(roadmap: Roadmap) {
		console.log('sharing');
	}
}
