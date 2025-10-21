import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Syllabus } from '../models/Syllabus';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SyllabusService {
	api: string = `${environment.API_URL}/syllabus`;
	http: HttpClient = inject(HttpClient);

	get(syllabusId: string): Observable<Syllabus> {
		return this.http.get<Syllabus>(`${this.api}/${syllabusId}`);
	}

	save(classroomId: string, syllabusList: Syllabus[]): Observable<Syllabus[]> {
		return this.http.post<Syllabus[]>(`${this.api}/${classroomId}`, { syllabusList });
	}

	edit(syllabusId: string, name: string, description: string): Observable<Syllabus> {
		return this.http.put<Syllabus>(`${this.api}/edit/${syllabusId}`, { name, description });
	}

	dowloadDefaultSyllabusJson(): Observable<Blob> {
		return this.http.get(`${this.api}/json`, { responseType: 'blob' });
	}

	downloadSyllabusJson(classroomId: string): Observable<Blob> {
		return this.http.get(`${this.api}/json/${classroomId}`, { responseType: 'blob' });
	}

	validateJsonFormat(file: File): Observable<{ valid: boolean }> {
		const formData: FormData = new FormData();
		formData.append('file', file);
		return this.http.post<{ valid: boolean }>(`${this.api}/validate-json`, formData);
	}
}
