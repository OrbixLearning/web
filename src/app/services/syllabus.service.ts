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

	create(classroomId: string, syllabusList: Syllabus[]): Observable<Syllabus[]> {
		return this.http.post<Syllabus[]>(this.api, { classroomId, syllabusList });
	}

	update(syllabusList: Syllabus[]): Observable<Syllabus[]> {
		return this.http.put<Syllabus[]>(this.api, syllabusList);
	}
}
