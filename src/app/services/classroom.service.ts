import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Classroom } from '../models/Classroom';
import { Page } from '../models/Page';

@Injectable({
	providedIn: 'root',
})
export class ClassroomService {
	api: string = `${environment.API_URL}/classroom`;
	http: HttpClient = inject(HttpClient);

	getUserClassrooms(institutionId: string): Observable<Classroom[]> {
		return this.http.get<Classroom[]>(`${this.api}/user/institution/${institutionId}`);
	}

	getInstitutionClassrooms(
		institutionId: string,
		page: number,
		size: number,
		nameFilter: string,
	): Observable<Page<Classroom>> {
		let params = new HttpParams().set('page', page).set('size', size).set('name', nameFilter);

		return this.http.get<Page<Classroom>>(`${this.api}/institution/${institutionId}`, { params });
	}

	deleteClassrooms(ids: string[]): Observable<void> {
		return this.http.put<void>(`${this.api}/delete-classrooms`, { ids });
	}

	create(institutionId: string, name: string, icon: string): Observable<Classroom> {
		return this.http.post<Classroom>(this.api, { institutionId, name, icon });
	}

	removeMember(classroomId: string, userAccountId: string): Observable<Classroom> {
		return this.http.put<Classroom>(`${this.api}/remove-member`, { classroomId, userAccountId });
	}
}
