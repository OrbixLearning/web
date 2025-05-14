import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Roadmap } from '../models/Roadmap';

@Injectable({
	providedIn: 'root',
})
export class RoadmapService {
	api: string = `${environment.API_URL}/roadmap`;
	http: HttpClient = inject(HttpClient);

	// GET

	get(roadmapId: string): Observable<Roadmap> {
		return this.http.get<Roadmap>(`${this.api}/${roadmapId}`);
	}

	getUserRoadmapsByInstitution(institutionId: string): Observable<Roadmap[]> {
		return this.http.get<Roadmap[]>(`${this.api}/institution/${institutionId}`);
	}

	getClassroomSharedRoadmaps(classroomId: string): Observable<Roadmap[]> {
		return this.http.get<Roadmap[]>(`${this.api}/classroom/${classroomId}`);
	}

	// UPDATE

	updateRoadmapSharing(id: string, share: boolean): Observable<Roadmap> {
		return this.http.put<Roadmap>(`${this.api}/share`, { id, share });
	}

	// GENERATION

	generateRoadmap(requestBody: any, endpoint: string): Observable<Roadmap> {
		return this.http.post<Roadmap>(`${this.api}/${endpoint}`, requestBody);
	}
}
