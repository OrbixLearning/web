import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
	FlashCardLearningPathStudy,
	LearningPathStudy,
	QuestionLearningPathStudy,
} from '../models/LearningPath/LearningPathStudy';

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

	clearAnswers(learningPathStudyId: string): Observable<QuestionLearningPathStudy> {
		return this.http.put<QuestionLearningPathStudy>(`${this.api}/${learningPathStudyId}/clear-answers`, {});
	}
}
