import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AIChatMessage } from '../models/AIChatMessage';

@Injectable({
	providedIn: 'root',
})
export class AIChatService {
	api: string = `${environment.API_URL}/chat`;
	http: HttpClient = inject(HttpClient);
	imageCacheBuster: number = 0;

	getChatHistory(classroomId: string, page: number, size: number): Observable<AIChatMessage[]> {
		let params = new HttpParams().set('page', page).set('size', size);
		return this.http.get<AIChatMessage[]>(`${this.api}/${classroomId}`, { params });
	}

	chat(
		classroomId: string,
		message: string,
		learningPathsIds: string[],
		file?: File,
	): Observable<{ aiMessage: AIChatMessage; userMessageId: string }> {
		const formData = new FormData();
		formData.append('message', message);
		formData.append('learningPathsIds', learningPathsIds.join(','));
		if (file) {
			formData.append('file', file);
		}
		return this.http.post<{ aiMessage: AIChatMessage; userMessageId: string }>(
			`${this.api}/${classroomId}`,
			formData,
		);
	}

	clear(classroomId: string): Observable<void> {
		return this.http.delete<void>(`${this.api}/${classroomId}/clear`);
	}

	getMessageImage(message: AIChatMessage): string {
		return `${this.api}/file/${message.id}?v=${this.imageCacheBuster}`;
	}
}
