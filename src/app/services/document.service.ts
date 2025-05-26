import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/Document';

@Injectable({
	providedIn: 'root',
})
export class DocumentService {
	api: string = `${environment.API_URL}/document`;
	http: HttpClient = inject(HttpClient);

	getFile(id: string): Observable<Blob> {
		return this.http.get(`${this.api}/${id}`, { responseType: 'blob' });
	}

	getByClassroom(classroomId: string): Observable<Document[]> {
		return this.http.get<Document[]>(`${this.api}/classroom/${classroomId}`);
	}

	uploadFile(name: string, syllabusIds: string[], classroomId: string, file: File): Observable<Document> {
		let formData = new FormData();
		formData.append('file', file);
		formData.append('name', name);
		formData.append('classroomId', classroomId);
		syllabusIds.forEach(id => formData.append('syllabusIds', id));
		return this.http.post<Document>(this.api, formData);
	}

	rename(documentId: string, name: string): Observable<Document> {
		return this.http.put<Document>(this.api, { documentId, name });
	}

	delete(documentId: string): Observable<void> {
		return this.http.delete<void>(`${this.api}/${documentId}`);
	}
}
