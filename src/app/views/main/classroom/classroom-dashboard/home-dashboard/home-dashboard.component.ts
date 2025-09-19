import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { lastValueFrom } from 'rxjs';
import { ClassroomCurrentScore } from '../../../../../models/Dashboard/ClassroomCurrentScore';
import { Syllabus } from '../../../../../models/Syllabus';
import { UserAccount } from '../../../../../models/User';
import { ContextService } from '../../../../../services/context.service';
import { DashboardService } from '../../../../../services/dashboard.service';
import { UserService } from '../../../../../services/user.service';
import { TreeUtils } from '../../../../../utils/Tree.utils';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { DateUtils } from '../../../../../utils/Date.util';

@Component({
	selector: 'o-home-dashboard',
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		RouterModule,
		ChartModule
	],
	templateUrl: './home-dashboard.component.html',
	styleUrl: './home-dashboard.component.scss',
})
export class HomeDashboardComponent {
	ctx: ContextService = inject(ContextService);
	service: DashboardService = inject(DashboardService);
	userService: UserService = inject(UserService);
	dialog: MatDialog = inject(MatDialog);

	isLoading = false;
	students: UserAccount[] = [];
	classroomCurrentScores: ClassroomCurrentScore[] = [];
	flatSyllabus: Syllabus[] = TreeUtils.flattenTree(this.ctx.classroom?.syllabus || [], 'topics');

	weeklyProgressData: any;
	gradeDistributionData: any;
	chartOptions: any;

	get totalStudents(): number {
    return this.students.length;
 	}

	get newStudentsCount(): number {
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
		return this.students.filter(s => new Date(s.user.createdAt!) > oneMonthAgo).length;
	}

	get classAverage(): number {
		if (this.classroomCurrentScores.length === 0) return 0;
		const totalScore = this.classroomCurrentScores.reduce((sum, score) => sum + score.average, 0);
		return totalScore / this.classroomCurrentScores.length;
	}

	get completionRate(): number {
		if (this.classroomCurrentScores.length === 0) return 0;
		const totalCompletion = this.classroomCurrentScores.reduce((sum, score) => sum + score.average, 0);
		return (totalCompletion / this.classroomCurrentScores.length);
	}


	get classroomBaseUrl() {
		return '/i/' + this.ctx.institution?.id + '/c/' + this.ctx.classroom?.id;
	}

	ngOnInit() {
		this.getData();
	}

	async getData() {
		this.isLoading = true;
		const classroomId = this.ctx.classroom?.id;
		if (!classroomId) {
			this.isLoading = false;
		return;
		}
		
		try {
		const [students, classroomCurrentScores] = await Promise.all([
			lastValueFrom(this.userService.getClassroomStudents(classroomId)),
			lastValueFrom(this.service.getClassroomCurrentScores(classroomId)),
		]);
		this.students = students;
		this.classroomCurrentScores = classroomCurrentScores;
		
		await this.setupCharts(classroomId);

		} catch (error) {
			console.error('Erro ao buscar dados do dashboard:', error);
		} finally {
			this.isLoading = false;
		}
	}


	async setupCharts(classroomId: string) {
		const grades = this.classroomCurrentScores.map(s => s.average);
		const totalGrades = grades.length;
		const gradeRanges = {
		'0-50': grades.filter(g => g <= 50).length,
		'51-70': grades.filter(g => g > 50 && g <= 70).length,
		'71-85': grades.filter(g => g > 70 && g <= 85).length,
		'86-100': grades.filter(g => g > 85).length,
		};
		this.gradeDistributionData = {
		labels: Object.keys(gradeRanges).map(range => {
			const count = gradeRanges[range as keyof typeof gradeRanges];
			const percentage = totalGrades > 0 ? ((count / totalGrades) * 100).toFixed(0) : 0;
			return `${range} (${percentage}%)`;
		}),
		datasets: [{ data: Object.values(gradeRanges), backgroundColor: ['#EF5350', '#FFA726', '#66BB6A', '#26A69A'] }]
		};

		const syllabusId = this.ctx.classroom?.syllabus?.[0]?.id;
		if (syllabusId) {
			const twoMonthsAgo = new Date();
			twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
			const history = await lastValueFrom(
				this.service.getClassroomScoreHistoryBySyllabus(syllabusId, DateUtils.format(twoMonthsAgo, 'YYYY-MM-DDThh:mm:ss'))
			);
			
			this.weeklyProgressData = {
				labels: history.map(h => DateUtils.format(h.date, 'DD/MM')),
				datasets: [{
				label: 'Progresso da Turma (Média)',
				data: history.map(h => h.average),
				fill: false,
				borderColor: '#42A5F5',
				tension: 0.4
				}]
			};
		}
	}

	getSyllabusScore(syllabusId: string): ClassroomCurrentScore | undefined {
		return this.classroomCurrentScores.find(score => score.syllabus.id === syllabusId);
	}

	forceUpdateScores() {
		const data: ConfirmPopUpData = {
			title: 'Essa ação pode demorar alguns minutos!',
			message: 'Você tem certeza que deseja forçar a atualização das notas?',
			confirmButton: 'Sim, forçar atualização',
		};
		this.dialog
			.open(ConfirmPopUpComponent, {
				data,
			})
			.afterClosed()
			.subscribe(async confirmed => {
				if (confirmed) {
					this.isLoading = true;
					await lastValueFrom(this.service.forceClassroomScoresUpdate(this.ctx.classroom?.id!))
						.then(async () => {
							await this.getData();
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}
}
