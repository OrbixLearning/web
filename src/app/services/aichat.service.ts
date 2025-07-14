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

	getChatHistory(classroomId: string, page: number, size: number): Observable<AIChatMessage[]> {
		let params = new HttpParams().set('page', page).set('size', size);
		return this.http.get<AIChatMessage[]>(`${this.api}/${classroomId}`, { params });
	}

	chat(classroomId: string, message: string): Observable<AIChatMessage> {
		return this.http.post<AIChatMessage>(`${this.api}/${classroomId}`, { message });
	}
}
