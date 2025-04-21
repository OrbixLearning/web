import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Classroom } from '../models/Classroom';

@Injectable({
	providedIn: 'root',
})
export class ClassroomService {
	api: string = `${environment.API_URL}/classroom`;
	http: HttpClient = inject(HttpClient);

	getClassrooms(institutionId: string): Observable<Classroom[]> {
		return this.http.get<Classroom[]>(`${this.api}/user/institution/${institutionId}`);
	}
}
