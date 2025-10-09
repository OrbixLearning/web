import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FlashCard } from '../models/LearningPath/FlashCard';
import {
	FlashCardLearningPath,
	LearningPath,
	TextLearningPath,
	VideoLearningPath,
} from '../models/LearningPath/LearningPath';
import { GenerateLearningPathRequest } from '../models/LearningPath/LearningPathGeneration';
import { VideoDetails } from '../models/LearningPath/VideoDetails';

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

	shareLearningPath(id: string): Observable<LearningPath> {
		return this.http.put<LearningPath>(`${this.api}/share/${id}`, {});
	}

	validateLearningPath(id: string, validate: boolean): Observable<LearningPath> {
		return this.http.put<LearningPath>(`${this.api}/validate/${id}`, { validate });
	}

	// GENERATION

	generateLearningPath(requestBody: GenerateLearningPathRequest, endpoint: string): Observable<LearningPath> {
		return this.http.post<LearningPath>(`${this.api}/${endpoint}`, requestBody);
	}

	regenerateLearningPath(id: string): Observable<LearningPath> {
		return this.http.put<LearningPath>(`${this.api}/regenerate/${id}`, {});
	}

	// DELETE

	delete(learningPathId: string): Observable<void> {
		return this.http.delete<void>(`${this.api}/${learningPathId}`);
	}

	// EDITING

	editTextLearningPath(learningPathId: string, text: string): Observable<TextLearningPath> {
		return this.http.put<TextLearningPath>(`${this.api}/text/${learningPathId}`, { text });
	}

	editVideoLearningPath(learningPathId: string, videoDetails: VideoDetails[]): Observable<VideoLearningPath> {
		return this.http.put<VideoLearningPath>(`${this.api}/video/${learningPathId}`, { videoDetails });
	}

	editFlashCardLearningPath(learningPathId: string, flashCards: FlashCard[]): Observable<FlashCardLearningPath> {
		return this.http.put<FlashCardLearningPath>(`${this.api}/flashcard/${learningPathId}`, { flashCards });
	}
}
