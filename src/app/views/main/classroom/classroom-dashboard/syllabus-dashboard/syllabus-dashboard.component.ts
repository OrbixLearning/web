import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../../components/loading/loading.component';
import { ClassroomScoreHistoryBySyllabus } from '../../../../../models/Dashboard/ClassroomScoreHistoryBySyllabus';
import { SyllabusRanking } from '../../../../../models/Dashboard/SyllabusRankingResponse';
import { ContextService } from '../../../../../services/context.service';
import { DashboardService } from '../../../../../services/dashboard.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateUtils } from '../../../../../utils/Date.util';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Syllabus } from '../../../../../models/Syllabus';
import { SyllabusService } from '../../../../../services/syllabus.service';
import { DisciplineCardComponent } from '../../../../../components/discipline-card/discipline-card.component';

import { ClassroomCurrentScore } from '../../../../../models/Dashboard/ClassroomCurrentScore';

@Component({
	selector: 'o-syllabus-dashboard',
	imports: [
    LoadingComponent,
    MatIconModule,
    RouterModule,
    ChartModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    DisciplineCardComponent
],
	templateUrl: './syllabus-dashboard.component.html',
	styleUrl: './syllabus-dashboard.component.scss',
	providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }, provideNativeDateAdapter()],
})
export class SyllabusDashboardComponent {
	ctx: ContextService = inject(ContextService);
	service: DashboardService = inject(DashboardService);
	syllabusService: SyllabusService = inject(SyllabusService);
	route: ActivatedRoute = inject(ActivatedRoute);

	isLoading = true;
  	disciplines: Syllabus[] = [];
	scores: ClassroomCurrentScore[] = [];
  	topicChartData: any;
	syllabus: Syllabus | undefined;
	ranking: SyllabusRanking[] = [];
	scoreHistory: ClassroomScoreHistoryBySyllabus[] = [];
	average: number = 0;
	max: number = 0;
	min: number = 0;
	count: number = 0;
	chartData: any = {};
	chartOptions: any = {};
	startDate: Date = new Date(DateUtils.today().setMonth(new Date().getMonth() - 1));

	get dashboardBaseUrl() {
		return '/i/' + this.ctx.institution?.id + '/c/' + this.ctx.classroom?.id + '/dashboard';
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
		const syllabusId = params['syllabusId'];
		if (syllabusId) {
			this.getSyllabusDetails(syllabusId);
		} else {
			this.loadAllDisciplines();
		}
		});
  	}

	async getData(syllabusId: string) {
		this.isLoading = true;
		this.disciplines = [];
		await Promise.all([
			lastValueFrom(this.syllabusService.get(syllabusId)),
			lastValueFrom(
				this.service.getClassroomScoreHistoryBySyllabus(syllabusId, this.formatDateISO(this.startDate)),
			),
			lastValueFrom(this.service.getRankingBySyllabus(syllabusId)),
		])
			.then(([syllabus, history, rankingResponse]) => {
				this.syllabus = syllabus;
				this.scoreHistory = history;
				if (this.scoreHistory.length > 0) {
					let lastValue: ClassroomScoreHistoryBySyllabus = history[history.length - 1];
					this.average = lastValue.average;
					this.max = lastValue.max;
					this.min = lastValue.min;
					this.count = lastValue.count;
					this.setChartData();
					this.setChartOptions();
				}
				this.ranking = rankingResponse;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async loadAllDisciplines() {
		this.isLoading = true;
		this.syllabus = undefined;
		const classroomId = this.ctx.classroom?.id;
		if (!classroomId) {
			this.isLoading = false;
			return;
		}

		try {
			this.scores = await lastValueFrom(this.service.getClassroomCurrentScores(classroomId));
			this.setupChart();
		} catch (error) {
			console.error('Erro ao carregar dados dos tópicos:', error);
		} finally {
			this.isLoading = false;
		}
	}

	setupChart() {
    	const sortedScores = [...this.scores].sort((a, b) => b.average - a.average);
		
		this.topicChartData = {
		labels: sortedScores.map(score => score.syllabus.name),
		datasets: [
			{
			label: 'Média de Notas da Turma',
			data: sortedScores.map(score => score.average),
			backgroundColor: '#0B57D0',
			borderRadius: 4,
          	barPercentage: 0.5,
			},
		],
		};

		this.chartOptions = {
			maintainAspectRatio: false,
			plugins: { legend: { display: false } },
			scales: {
				y: { 
					beginAtZero: true, 
					max: 100, 
					grid: { color: '#f0f0f0' },
					ticks: { stepSize: 25 }
				},
				x: { 
					grid: { display: false } 
				}
			}
		};
  	}

	getScoreForSyllabus(syllabusItem: Syllabus): ClassroomCurrentScore | undefined {
		return this.scores.find(s => s.syllabus.id === syllabusItem.id);
	}

	async getSyllabusDetails(syllabusId: string) {
		this.isLoading = true;
		const startDate = new Date();
		startDate.setMonth(startDate.getMonth() - 1);

		try {
			const [syllabus, history, ranking] = await Promise.all([
				lastValueFrom(this.syllabusService.get(syllabusId)),
				lastValueFrom(this.service.getClassroomScoreHistoryBySyllabus(syllabusId, DateUtils.format(startDate, 'YYYY-MM-DDThh:mm:ss'))),
				lastValueFrom(this.service.getRankingBySyllabus(syllabusId)),
			]);
			
			this.syllabus = syllabus;
			this.scoreHistory = history;
			this.ranking = ranking;
		} catch (error) {
			console.error(`Erro ao buscar detalhes para o syllabus ${syllabusId}:`, error);
		} finally {
			this.isLoading = false;
		}
	}

	setChartData() {
		this.chartData = {
			labels: this.scoreHistory.map(item => this.formatDateView(item.date)),
			datasets: [
				{
					label: 'Pontuação média',
					data: this.scoreHistory.map(item => item.average),
					fill: false,
					borderColor: '#42A5F5',
					tension: 0.1,
				},
				{
					label: 'Pontuação máxima',
					data: this.scoreHistory.map(item => item.max),
					fill: false,
					borderColor: '#66BB6A',
					tension: 0.1,
				},
				{
					label: 'Pontuação mínima',
					data: this.scoreHistory.map(item => item.min),
					fill: false,
					borderColor: '#EF5350',
					tension: 0.1,
				},
			],
		};
	}

	setChartOptions() {
		this.chartOptions = {};
	}

	formatDateView(date: Date): string {
		return DateUtils.format(date, 'DD/MM/YYYY');
	}

	formatDateISO(date: Date): string {
		return DateUtils.format(date, 'YYYY-MM-DDThh:mm:ss');
	}
}
