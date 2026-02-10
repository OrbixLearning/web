import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Question } from '../models/Question';
import { QuestionData } from '../models/QuestionData';
import { Syllabus } from '../models/Syllabus';

@Injectable({
	providedIn: 'root',
})
export class QuestionDataService {
	api: string = `${environment.API_URL}/question-data`;
	http: HttpClient = inject(HttpClient);

	getByClassroom(classroomId: string): Observable<QuestionData[]> {
		return this.http.get<QuestionData[]>(`${this.api}/${classroomId}`);
	}

	create(questionData: QuestionData, classroomId: string, syllabus: Syllabus[]): Observable<QuestionData> {
		return this.http.post<QuestionData>(this.api, { questionData, classroomId, syllabus });
	}

	update(id: string, question: Question, syllabus: Syllabus[]): Observable<QuestionData> {
		return this.http.put<QuestionData>(`${this.api}/${id}`, { question, syllabus });
	}

	delete(id: string): Observable<void> {
		return this.http.delete<void>(`${this.api}/${id}`);
	}
}
