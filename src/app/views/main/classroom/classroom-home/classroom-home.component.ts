import { Component, inject } from '@angular/core';
import { ContextService } from '../../../../services/context.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { RoadmapCardComponent } from '../../../../components/roadmap-card/roadmap-card.component';
import { RoadmapService } from '../../../../services/roadmap.service';
import { Roadmap } from '../../../../models/Roadmap';

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

	isLoading: boolean = true;
	isProfessor: boolean = false; // TODO
	myRoadmaps: Roadmap[] = [];
	sharedRoadmaps: Roadmap[] = [];

	ngOnInit() {
		this.getData();
	}

	get baseUrl() {
		return '/i/' + this.ctx.institution?.id + '/c/' + this.ctx.classroom?.id;
	}

	// get teacherRoadmaps(): Roadmap[] {}

	// get studentRoadmaps(): Roadmap[] {}

	async getData() {
		this.isLoading = true;
		// Promise.all
	}
}
