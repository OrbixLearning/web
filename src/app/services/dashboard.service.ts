import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClassroomCurrentScore } from '../models/Dashboard/ClassroomCurrentScore';
import { ClassroomScoreHistoryBySyllabus } from '../models/Dashboard/ClassroomScoreHistoryBySyllabus';
import { StudentCurrentScore } from '../models/Dashboard/StudentCurrentScore';
import { StudentScoreHistoryBySyllabus } from '../models/Dashboard/StudentScoreHistoryBySyllabus';
import { SyllabusRanking } from '../models/Dashboard/SyllabusRankingResponse';

@Injectable({
	providedIn: 'root',
})
export class DashboardService {
	api: string = `${environment.API_URL}/dashboard`;
	http: HttpClient = inject(HttpClient);

	getClassroomCurrentScores(classroomId: string): Observable<ClassroomCurrentScore[]> {
		return this.http.get<ClassroomCurrentScore[]>(`${this.api}/current/${classroomId}`);
	}

	getStudentCurrentScores(classroomId: string, userId: string): Observable<StudentCurrentScore[]> {
		return this.http.get<StudentCurrentScore[]>(`${this.api}/current/${classroomId}/${userId}`);
	}

	getClassroomScoreHistoryBySyllabus(
		syllabusId: string,
		startDate: string,
		endDate?: string,
	): Observable<ClassroomScoreHistoryBySyllabus[]> {
		let params = new HttpParams();
		params.set('startDate', startDate);
		if (endDate) params = params.set('endDate', endDate);
		return this.http.get<ClassroomScoreHistoryBySyllabus[]>(`${this.api}/history/${syllabusId}`, { params });
	}

	getStudentScoreHistoryBySyllabus(
		syllabusId: string,
		userId: string,
		startDate: string,
		endDate?: string,
	): Observable<StudentScoreHistoryBySyllabus[]> {
		let params = new HttpParams();
		params = params.set('startDate', startDate);
		if (endDate) params = params.set('endDate', endDate);
		return this.http.get<StudentScoreHistoryBySyllabus[]>(`${this.api}/history/${syllabusId}/${userId}`, {
			params,
		});
	}

	getRankingBySyllabus(syllabusId: string): Observable<SyllabusRanking[]> {
		return this.http.get<SyllabusRanking[]>(`${this.api}/ranking/${syllabusId}`);
	}
}
