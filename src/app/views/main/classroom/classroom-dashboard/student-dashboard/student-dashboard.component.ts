import { Component, inject } from '@angular/core';
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
import { ChartModule } from 'primeng/chart';
import { StudentScoreHistoryBySyllabus } from '../../../../../models/Dashboard/StudentScoreHistoryBySyllabus';
import { DateUtils } from '../../../../../utils/Date.util';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StudentTableData extends UserAccount {
  geralGrade: number;
  activities: number;
  conclusion: number;
  trend: 'north' | 'south' | 'minimize';
}

@Component({
	selector: 'o-student-dashboard',
	imports: [
		CommonModule,
		FormsModule,
		MatIconModule,
		RouterModule,
		LoadingComponent,
		AccordionModule,
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
	students: StudentTableData[] = [];
	filteredStudents: StudentTableData[] = [];
  	searchTerm = '';
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
    	this.loadStudentList();
  	}
	async loadStudentList() {
		this.isLoading = true;
		this.studentAccount = undefined;
		const classroomId = this.ctx.classroom?.id;
		if (!classroomId) {
			this.isLoading = false;
			return;
		}

		try {
			const accounts = await lastValueFrom(this.userService.getClassroomStudents(classroomId));
			const firstSyllabusId = this.flatSyllabus[0]?.id;

			const studentDataPromises = accounts.map(async (account) => {
				const scores = await lastValueFrom(this.service.getStudentCurrentScores(classroomId, account.id));
				let history: StudentScoreHistoryBySyllabus[] = [];
				if (firstSyllabusId) {
				history = await lastValueFrom(this.service.getStudentScoreHistoryBySyllabus(firstSyllabusId, account.id));
				}

				const totalScore = scores.reduce((sum, score) => sum + score.value, 0);
				const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
				const completion = this.flatSyllabus.length > 0 ? (scores.length / this.flatSyllabus.length) : 0;

				let trend: 'north' | 'south' | 'minimize' = 'minimize';
				if (history.length >= 2) {
					const lastScore = history[history.length - 1].value;
					const previousScore = history[history.length - 2].value;
					if (lastScore > previousScore) trend = 'north';
					else if (lastScore < previousScore) trend = 'south';
				}

				return {
				...account,
				geralGrade: averageScore,
				activities: scores.length,
				conclusion: completion,
				trend: trend,
				};
			});

			this.students = await Promise.all(studentDataPromises);
			this.filteredStudents = this.students;

		} catch (error) {
			console.error('Erro ao carregar lista de estudantes:', error);
		} finally {
			this.isLoading = false;
		}
	}

	search(): void {
		if (!this.searchTerm) {
			this.filteredStudents = this.students;
			return;
		}
		const lowerCaseSearch = this.searchTerm.toLowerCase();
		this.filteredStudents = this.students.filter(
			student => student.user.name.toLowerCase().includes(lowerCaseSearch)
		);
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
