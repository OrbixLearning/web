import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlashCardLearningPathStudy, LearningPathStudy } from '../models/LearningPath/LearningPathStudy';

@Injectable({
	providedIn: 'root',
})
export class LearningPathStudyService {
	api: string = `${environment.API_URL}/learning-path-study`;
	http: HttpClient = inject(HttpClient);

	get(learningPathId: string): Observable<LearningPathStudy> {
		return this.http.get<LearningPathStudy>(`${this.api}/${learningPathId}`);
	}

	shuffle(learningPathId: string): Observable<FlashCardLearningPathStudy> {
		return this.http.put<FlashCardLearningPathStudy>(`${this.api}/${learningPathId}/shuffle`, {});
	}

	answer(learningPathStudyId: string, questionIndex: number, answer: string[]): Observable<LearningPathStudy> {
		return this.http.put<LearningPathStudy>(`${this.api}/${learningPathStudyId}/answer`, {
			questionIndex,
			answer,
		});
	}
}
