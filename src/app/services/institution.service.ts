import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { Institution } from '../models/Institution';

@Injectable({
	providedIn: 'root',
})
export class InstitutionService {
	api: string = `${environment.API_URL}/institution`;
	http: HttpClient = inject(HttpClient);

	getUserInstitutions(): Observable<Institution[]> {
		return this.http.get<Institution[]>(`${this.api}/user`);
	}

	getInstitutionRoles(id: string): Observable<InstitutionRoleEnum[]> {
		return this.http.get<InstitutionRoleEnum[]>(`${this.api}/role/${id}`);
	}

	update(id: string, name: string, primaryColor: string, secondaryColor: string): Observable<Institution> {
		return this.http.put<Institution>(this.api, {
			id,
			name,
			primaryColor,
			secondaryColor,
		});
	}
}
