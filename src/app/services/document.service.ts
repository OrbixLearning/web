import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Document } from '../models/Document';
import { DocumentTypeEnum } from '../enums/DocumentType.enum';

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

	uploadFile(
		name: string,
		syllabusIds: string[],
		classroomId: string,
		feedAi: boolean,
		hidden: boolean,
		type: DocumentTypeEnum,
		file: File,
	): Observable<Document> {
		let formData = new FormData();
		formData.append('file', file);
		formData.append('name', name);
		formData.append('classroomId', classroomId);
		formData.append('feedAi', String(feedAi));
		formData.append('hidden', String(hidden));
		formData.append('type', type);
		syllabusIds.forEach(id => formData.append('syllabusIds', id));
		return this.http.post<Document>(this.api, formData);
	}

	update(
		documentId: string,
		name: string,
		hidden: boolean,
		type: DocumentTypeEnum,
		syllabusIds: string[],
	): Observable<Document> {
		return this.http.put<Document>(`${this.api}/${documentId}`, { name, hidden, type, syllabusIds });
	}

	recallAI(id: string): Observable<Document> {
		return this.http.put<Document>(`${this.api}/recall-ai/${id}`, {});
	}

	delete(documentId: string): Observable<void> {
		return this.http.delete<void>(`${this.api}/${documentId}`);
	}
}
