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
import { AccordionModule, AccordionTabOpenEvent } from 'primeng/accordion';
import { ProgressBar } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart';
import { StudentScoreHistoryBySyllabus } from '../../../../../models/Dashboard/StudentScoreHistoryBySyllabus';
import { DateUtils } from '../../../../../utils/Date.util';

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
					label: 'Pontuação média',
					data: history.map(item => item.value),
					fill: false,
					borderColor: '#42A5F5',
					tension: 0.1,
				},
			],
		};
	}

	getChartOptions() {
		return {};
	}

	formatDateView(date: Date): string {
		return DateUtils.format(date, 'DD/MM/YYYY');
	}

	formatDateISO(date: Date): string {
		return DateUtils.format(date, 'YYYY-MM-DDThh:mm:ss');
	}
}
