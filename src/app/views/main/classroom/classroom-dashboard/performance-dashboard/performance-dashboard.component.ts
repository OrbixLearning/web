import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { lastValueFrom } from 'rxjs';
import { ContextService } from '../../../../../services/context.service';
import { DashboardService } from '../../../../../services/dashboard.service';
import { SyllabusRanking } from '../../../../../models/Dashboard/SyllabusRankingResponse';
import { LoadingComponent } from '../../../../../components/loading/loading.component';
import { ClassroomCurrentScore } from '../../../../../models/Dashboard/ClassroomCurrentScore';

@Component({
  selector: 'o-performance-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, LoadingComponent],
  templateUrl: './performance-dashboard.component.html',
  styleUrls: ['./performance-dashboard.component.scss'],
})
export class PerformanceDashboardComponent implements OnInit {
  ctx: ContextService = inject(ContextService);
  dashboardService: DashboardService = inject(DashboardService);

  isLoading = true;
  performanceChartData: any;
  chartOptions: any;
  classStats: any = {};

  ngOnInit() {
    this.loadPerformanceData();
  }

  async loadPerformanceData() {
    this.isLoading = true;
    const classroomId = this.ctx.classroom?.id;
    const firstSyllabusId = this.ctx.classroom?.syllabus?.[0]?.id;

    if (!classroomId) {
      this.isLoading = false;
      return;
    }

    try {
      const scoresPromise = lastValueFrom(this.dashboardService.getClassroomCurrentScores(classroomId));
      const rankingPromise = firstSyllabusId 
        ? lastValueFrom(this.dashboardService.getRankingBySyllabus(firstSyllabusId))
        : Promise.resolve([]);
      const [scores, ranking] = await Promise.all([scoresPromise, rankingPromise]);

      this.calculateClassStats(scores, ranking);
      this.setupPerformanceChart(scores);

    } catch (error) {
        console.error('Erro ao carregar dados de desempenho:', error);
    } finally {
       this.isLoading = false;
    }
  }

  calculateClassStats(scores: ClassroomCurrentScore[], ranking: SyllabusRanking[]) {
    const bestStudent = ranking[0];
    if (bestStudent) {
      this.classStats.bestNote = {
        name: bestStudent.student.user.name,
        value: bestStudent.value / 10,
      };
    }
    if (scores.length > 0) {
      const totalAverage = scores.reduce((sum, score) => sum + score.average, 0);
      this.classStats.classAverage = (totalAverage / scores.length) / 10;
    }
    const passingThreshold = 70;
    const approvedCount = scores.filter(s => s.average >= passingThreshold).length;
    this.classStats.approvalRate = scores.length > 0 ? (approvedCount / scores.length) * 100 : 0;
    this.classStats.averageFrequency = '--';
  }

  setupPerformanceChart(scores: ClassroomCurrentScore[]) {
    const chartLabels = this.ctx.classroom?.syllabus.slice(0, 5).map(s => s.name) || [];
    const chartData = chartLabels.map(label => {
      const scoreData = scores.find(s => s.syllabus.name === label);
      return scoreData ? scoreData.average : 0;
    });

    this.performanceChartData = {
      labels: chartLabels,
      datasets: [
        {
          label: 'Média da Turma',
          data: chartData,
          fill: true,
          backgroundColor: 'rgba(11, 87, 208, 0.2)',
          borderColor: '#0B57D0',
          pointBackgroundColor: '#0B57D0',
        }
      ]
    };

    this.chartOptions = {
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: { stepSize: 25 },
            }
        }
    };
  }
}