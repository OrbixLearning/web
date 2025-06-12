import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LearningPath } from '../models/LearningPath';

@Injectable({
	providedIn: 'root',
})
export class LearningPathService {
	api: string = `${environment.API_URL}/learning-path`;
	http: HttpClient = inject(HttpClient);

	// GET

	getUserLearningPathsByClassroom(classroomId: string): Observable<LearningPath[]> {
		return this.http.get<LearningPath[]>(`${this.api}/classroom/${classroomId}`);
	}

	getClassroomSharedLearningPaths(classroomId: string): Observable<LearningPath[]> {
		return this.http.get<LearningPath[]>(`${this.api}/shared/classroom/${classroomId}`);
	}

	getAudioUrl(learningPathId: string, number: number): string {
		return `${this.api}/audio/${learningPathId}/${number}`;
	}

	downloadPdf(learningPathId: string): Observable<Blob> {
		return this.http.get(`${this.api}/pdf/${learningPathId}`, { responseType: 'blob' });
	}

	// UPDATE

	updateLearningPathSharing(id: string, share: boolean): Observable<LearningPath> {
		return this.http.put<LearningPath>(`${this.api}/share`, { id, share });
	}

	validateLearningPath(id: string, validate: boolean): Observable<LearningPath> {
		return this.http.put<LearningPath>(`${this.api}/validate`, { id, validate });
	}

	// GENERATION

	generateLearningPath(requestBody: any, endpoint: string): Observable<LearningPath> {
		return this.http.post<LearningPath>(`${this.api}/${endpoint}`, requestBody);
	}

	// DELETE

	delete(learningPathId: string): Observable<void> {
		return this.http.delete<void>(`${this.api}/${learningPathId}`);
	}
}
