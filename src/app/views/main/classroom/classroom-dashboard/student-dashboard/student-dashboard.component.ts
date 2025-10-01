import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccordionModule, AccordionTabOpenEvent } from 'primeng/accordion';
import { ChartModule } from 'primeng/chart';
import { ProgressBar } from 'primeng/progressbar';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../../components/loading/loading.component';
import { SubHeaderComponent } from '../../../../../components/sub-header/sub-header.component';
import { StudentCurrentScore } from '../../../../../models/Dashboard/StudentCurrentScore';
import { StudentScoreHistoryBySyllabus } from '../../../../../models/Dashboard/StudentScoreHistoryBySyllabus';
import { Syllabus } from '../../../../../models/Syllabus';
import { UserAccount } from '../../../../../models/User';
import { ContextService } from '../../../../../services/context.service';
import { DashboardService } from '../../../../../services/dashboard.service';
import { UserService } from '../../../../../services/user.service';
import { DateUtils } from '../../../../../utils/Date.util';
import { TreeUtils } from '../../../../../utils/Tree.utils';
import { AvatarComponent } from '../../../../../components/avatar/avatar.component';

@Component({
	selector: 'o-student-dashboard',
	imports: [
		MatButtonModule,
		MatIconModule,
		RouterModule,
		LoadingComponent,
		AccordionModule,
		ProgressBar,
		ChartModule,
		SubHeaderComponent,
		AvatarComponent,
	],
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
	currentScores: Map<string, StudentCurrentScore> = new Map<string, StudentCurrentScore>();
	studentAccount: UserAccount | undefined;
	histories: Map<string, StudentScoreHistoryBySyllabus[]> = new Map<string, StudentScoreHistoryBySyllabus[]>();

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
				scores.forEach(score => {
					this.currentScores.set(score.syllabus.id!, score);
				});
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	getSyllabusHistory(event: AccordionTabOpenEvent) {
		const syllabusId = this.flatSyllabus[event.index].id!;
		lastValueFrom(this.service.getStudentScoreHistoryBySyllabus(syllabusId, this.studentAccount?.id!)).then(
			histories => {
				this.histories.set(syllabusId, histories);
			},
		);
	}

	getChartData(history: StudentScoreHistoryBySyllabus[]) {
		return {
			labels: history.map(item => this.formatDateView(item.update)),
			datasets: [
				{
					label: 'Pontuação',
					data: history.map(item => item.value),
					fill: false,
					borderColor: '#42A5F5',
					tension: 0.1,
				},
			],
		};
	}

	getChartOptions() {
		return {
			scales: {
				y: {
					min: 0,
					max: 100,
				},
			},
		};
	}

	formatDateView(date: Date): string {
		return DateUtils.format(date, 'DD/MM/YYYY');
	}

	formatDateISO(date: Date): string {
		return DateUtils.format(date, 'YYYY-MM-DDThh:mm:ss');
	}
}
