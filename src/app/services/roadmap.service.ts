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

	getUserRoadmapsByInstitution(institutionId: string): Observable<Roadmap[]> {
		return this.http.get<Roadmap[]>(`${this.api}/${institutionId}`);
	}

	getClassroomSharedRoadmaps(classroomId: string): Observable<Roadmap[]> {
		return this.http.get<Roadmap[]>(`${this.api}/classroom/${classroomId}`);
	}
}
