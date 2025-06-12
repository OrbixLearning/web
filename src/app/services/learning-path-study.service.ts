import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoadmapStudy } from '../models/LearningPathStudy';

@Injectable({
	providedIn: 'root',
})
export class RoadmapStudyService {
	api: string = `${environment.API_URL}/roadmap-study`;
	http: HttpClient = inject(HttpClient);

	get(roadmapId: string): Observable<RoadmapStudy> {
		return this.http.get<RoadmapStudy>(`${this.api}/${roadmapId}`);
	}
}
