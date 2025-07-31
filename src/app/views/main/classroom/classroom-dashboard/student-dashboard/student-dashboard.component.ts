import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContextService } from '../../../../../services/context.service';
import { DashboardService } from '../../../../../services/dashboard.service';
import { UserService } from '../../../../../services/user.service';
import { Syllabus } from '../../../../../models/Syllabus';
import { TreeUtils } from '../../../../../utils/Tree.utils';
import { StudentCurrentScore } from '../../../../../models/Dashboard/StudentCurrentScore';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserAccount } from '../../../../../models/User';
import { LoadingComponent } from '../../../../../components/loading/loading.component';
import { AccordionModule } from 'primeng/accordion';
import { ProgressBar } from 'primeng/progressbar';

@Component({
	selector: 'o-student-dashboard',
	imports: [MatButtonModule, MatIconModule, RouterModule, LoadingComponent, AccordionModule, ProgressBar],
	templateUrl: './student-dashboard.component.html',
	styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent {
	ctx: ContextService = inject(ContextService);
	service: DashboardService = inject(DashboardService);
	userService: UserService = inject(UserService);
	route: ActivatedRoute = inject(ActivatedRoute);

	isLoading = false;
	flatSyllabus: Syllabus[] = TreeUtils.flattenTree(this.ctx.classroom?.syllabus || [], 'topics');
	studentCurrentScores: StudentCurrentScore[] = [];
	studentAccount: UserAccount | undefined;

	get dashboardBaseUrl() {
		return '/i/' + this.ctx.institution?.id + '/c/' + this.ctx.classroom?.id + '/dashboard';
	}

	get profilePictureUrl(): string {
		if (!this.studentAccount?.user) {
			return '';
		}
		return this.userService.getProfilePictureUrl(this.studentAccount.user);
	}

	ngOnInit() {
		// This is used to update the data when the studentId changes in the URL
		this.route.params.subscribe(params => {
			this.getData(params['studentId']);
		});
	}

	async getData(studentId: string) {
		this.isLoading = true;
		Promise.all([
			lastValueFrom(this.userService.getAccount(studentId)),
			lastValueFrom(this.service.getStudentCurrentScores(this.ctx.classroom?.id!, studentId)),
		])
			.then(([account, scores]) => {
				this.studentAccount = account;
				this.studentCurrentScores = scores;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	getSyllabusScore(syllabusId: string): StudentCurrentScore | undefined {
		return this.studentCurrentScores.find(score => score.syllabus.id === syllabusId);
	}
}
