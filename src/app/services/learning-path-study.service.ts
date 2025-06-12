import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LearningPathStudy } from '../models/LearningPathStudy';

@Injectable({
	providedIn: 'root',
})
export class LearningPathStudyService {
	api: string = `${environment.API_URL}/learning-path-study`;
	http: HttpClient = inject(HttpClient);

	get(learningPathId: string): Observable<LearningPathStudy> {
		return this.http.get<LearningPathStudy>(`${this.api}/${learningPathId}`);
	}
}
