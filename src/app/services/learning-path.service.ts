import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Roadmap } from '../models/LearningPath';

@Injectable({
	providedIn: 'root',
})
export class RoadmapService {
	api: string = `${environment.API_URL}/roadmap`;
	http: HttpClient = inject(HttpClient);

	// GET

	getUserRoadmapsByClassroom(classroomId: string): Observable<Roadmap[]> {
		return this.http.get<Roadmap[]>(`${this.api}/classroom/${classroomId}`);
	}

	getClassroomSharedRoadmaps(classroomId: string): Observable<Roadmap[]> {
		return this.http.get<Roadmap[]>(`${this.api}/shared/classroom/${classroomId}`);
	}

	getAudioUrl(roadmapId: string, number: number): string {
		return `${this.api}/audio/${roadmapId}/${number}`;
	}

	downloadPdf(roadmapId: string): Observable<Blob> {
		return this.http.get(`${this.api}/pdf/${roadmapId}`, { responseType: 'blob' });
	}

	// UPDATE

	updateRoadmapSharing(id: string, share: boolean): Observable<Roadmap> {
		return this.http.put<Roadmap>(`${this.api}/share`, { id, share });
	}

	validateRoadmap(id: string, validate: boolean): Observable<Roadmap> {
		return this.http.put<Roadmap>(`${this.api}/validate`, { id, validate });
	}

	// GENERATION

	generateRoadmap(requestBody: any, endpoint: string): Observable<Roadmap> {
		return this.http.post<Roadmap>(`${this.api}/${endpoint}`, requestBody);
	}

	// DELETE

	delete(roadmapId: string): Observable<void> {
		return this.http.delete<void>(`${this.api}/${roadmapId}`);
	}
}
