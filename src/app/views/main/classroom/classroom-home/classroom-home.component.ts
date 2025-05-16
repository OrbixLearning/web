import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { lastValueFrom } from 'rxjs';
import { RoadmapCreationPopUpComponent } from '../../../../components/pop-ups/roadmap-creation-pop-up/roadmap-creation-pop-up.component';
import { RoadmapCardComponent } from '../../../../components/roadmap-card/roadmap-card.component';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { InstitutionRoleEnum } from '../../../../enums/InstitutionRole.enum';
import { Roadmap } from '../../../../models/Roadmap';
import { ContextService } from '../../../../services/context.service';
import { RoadmapService } from '../../../../services/roadmap.service';
import { Syllabus } from '../../../../models/Syllabus';
import { FormsModule } from '@angular/forms';
import { ArrayUtils } from '../../../../utils/Array.utils';

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
		FormsModule,
	],
	templateUrl: './classroom-home.component.html',
	styleUrl: './classroom-home.component.scss',
})
export class ClassroomHomeComponent {
	ctx: ContextService = inject(ContextService);
	roadmapService: RoadmapService = inject(RoadmapService);
	dialog: MatDialog = inject(MatDialog);
	router: Router = inject(Router);
	route: ActivatedRoute = inject(ActivatedRoute);

	isLoading: boolean = true;
	myRoadmaps: Roadmap[] = [];
	sharedRoadmaps: Roadmap[] = [];
	filter: string = '';
	syllabusFilter: string[] = [];

	ngOnInit() {
		// This is used to update the data when the classroomId changes in the URL
		this.route.params.subscribe(params => {
			this.resetData();
			this.getData();
		});
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

	get filteredMyRoadmaps(): Roadmap[] {
		return this.myRoadmaps.filter(this.filterRoadmap);
	}

	get filteredStudentRoadmaps(): Roadmap[] {
		return this.studentRoadmaps.filter(this.filterRoadmap);
	}

	get filteredTeacherRoadmaps(): Roadmap[] {
		return this.teacherRoadmaps.filter(this.filterRoadmap);
	}

	// TODO: Do a performance test later to see if this the filtering should be async or not
	filterRoadmap = (roadmap: Roadmap): boolean => {
		const filteredBySyllabus =
			this.syllabusFilter.length === 0 ||
			ArrayUtils.hasAllItems(
				roadmap.syllabus.map(r => r.id),
				this.syllabusFilter,
			);

		const filteredByName =
			roadmap.name.toLowerCase().includes(this.filter.toLowerCase()) ||
			roadmap.user.name.toLowerCase().includes(this.filter.toLowerCase());

		return filteredBySyllabus && filteredByName;
	};

	resetData() {
		this.myRoadmaps = [];
		this.sharedRoadmaps = [];
	}

	async getData() {
		this.isLoading = true;
		Promise.all([
			lastValueFrom(this.roadmapService.getUserRoadmapsByClassroom(this.ctx.classroom?.id!)),
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

	markSyllabus(syllabus: Syllabus[]) {
		this.syllabusFilter = syllabus.map(s => s.id);
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
		this.ctx.roadmap = roadmap;
		this.router.navigate(['/i', this.ctx.institution?.id, 'c', this.ctx.classroom?.id, 'r', roadmap.id]);
	}

	async updatedRoadmapSharing(roadmap: Roadmap) {
		this.isLoading = true;
		await lastValueFrom(this.roadmapService.updateRoadmapSharing(roadmap.id, roadmap.shared)).finally(() => {
			this.isLoading = false;
		});
	}
}
