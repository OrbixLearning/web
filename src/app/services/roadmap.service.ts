import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AudioRoadmap, FlashCardRoadmap, QuestionRoadmap, Roadmap, VideoRoadmap } from '../models/Roadmap';

@Injectable({
	providedIn: 'root',
})
export class RoadmapService {
	api: string = `${environment.API_URL}/roadmap`;
	http: HttpClient = inject(HttpClient);

	// GET

	getUserRoadmapsByInstitution(institutionId: string): Observable<Roadmap[]> {
		return this.http.get<Roadmap[]>(`${this.api}/${institutionId}`);
	}

	getClassroomSharedRoadmaps(classroomId: string): Observable<Roadmap[]> {
		return this.http.get<Roadmap[]>(`${this.api}/classroom/${classroomId}`);
	}

	// GENERATION

	generateRoadmap(requestBody: any, endpoint: string): Observable<Roadmap> {
		return this.http.post<Roadmap>(`${this.api}/${endpoint}`, requestBody);
	}
}
