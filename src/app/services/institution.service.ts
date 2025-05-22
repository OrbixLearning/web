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

	getLogoUrl(institutionId: string): string {
		return `${this.api}/logo/${institutionId}?v=${Date.now()}`; // Cache busting
	}

	update(
		id: string,
		name: string,
		primaryColor: string,
		secondaryColor: string,
		logo: File | undefined,
	): Observable<Institution> {
		const formData = new FormData();
		formData.append('id', id);
		formData.append('name', name);
		formData.append('primaryColor', primaryColor);
		formData.append('secondaryColor', secondaryColor);
		if (logo) {
			formData.append('logo', logo);
		}
		return this.http.put<Institution>(this.api, formData);
	}
}
