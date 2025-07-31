import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../../components/loading/loading.component';
import { ClassroomCurrentScore } from '../../../../../models/Dashboard/ClassroomCurrentScore';
import { Syllabus } from '../../../../../models/Syllabus';
import { UserAccount } from '../../../../../models/User';
import { ContextService } from '../../../../../services/context.service';
import { DashboardService } from '../../../../../services/dashboard.service';
import { UserService } from '../../../../../services/user.service';
import { TreeUtils } from '../../../../../utils/Tree.utils';

@Component({
	selector: 'o-home-dashboard',
	imports: [LoadingComponent, MatButtonModule, MatIconModule, RouterModule, ProgressBarModule],
	templateUrl: './home-dashboard.component.html',
	styleUrl: './home-dashboard.component.scss',
})
export class HomeDashboardComponent {
	ctx: ContextService = inject(ContextService);
	service: DashboardService = inject(DashboardService);
	userService: UserService = inject(UserService);

	isLoading = false;
	students: UserAccount[] = [];
	classroomCurrentScores: ClassroomCurrentScore[] = [];
	flatSyllabus: Syllabus[] = TreeUtils.flattenTree(this.ctx.classroom?.syllabus || [], 'topics');

	get classroomBaseUrl() {
		return '/i/' + this.ctx.institution?.id + '/c/' + this.ctx.classroom?.id;
	}

	ngOnInit() {
		this.getData();
	}

	async getData() {
		this.isLoading = true;
		Promise.all([
			lastValueFrom(this.userService.getClassroomStudents(this.ctx.classroom?.id!)),
			lastValueFrom(this.service.getClassroomCurrentScores(this.ctx.classroom?.id!)),
		])
			.then(([students, classroomCurrentScores]) => {
				this.students = students;
				this.classroomCurrentScores = classroomCurrentScores;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	getSyllabusScore(syllabusId: string): ClassroomCurrentScore | undefined {
		return this.classroomCurrentScores.find(score => score.syllabus.id === syllabusId);
	}
}
