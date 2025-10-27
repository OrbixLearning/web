import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { Institution } from '../models/Institution';
import { MultipleUserCreationResult } from '../components/pop-ups/user-creation-pop-up/user-creation-pop-up.component';

@Injectable({
	providedIn: 'root',
})
export class InstitutionService {
	api: string = `${environment.API_URL}/institution`;
	http: HttpClient = inject(HttpClient);
	imageCacheBuster: number = 0;

	getUserInstitutions(): Observable<Institution[]> {
		return this.http.get<Institution[]>(`${this.api}/user`);
	}

	getInstitutionRoles(id: string): Observable<InstitutionRoleEnum[]> {
		return this.http.get<InstitutionRoleEnum[]>(`${this.api}/role/${id}`);
	}

	getLogoUrl(institutionId: string): string {
		return `${this.api}/logo/${institutionId}?v=${this.imageCacheBuster}`;
	}

	private bustImageCache() {
		this.imageCacheBuster++;
	}

	update(
		id: string,
		name: string,
		logo: File | undefined,
		primaryColor: string,
		secondaryColor: string,
		backgroundColor: string,
		textColor: string,
		theme: string,
	): Observable<Institution> {
		const formData = new FormData();
		formData.append('id', id);
		formData.append('name', name);
		formData.append('primaryColor', primaryColor);
		formData.append('secondaryColor', secondaryColor);
		formData.append('backgroundColor', backgroundColor);
		formData.append('textColor', textColor);
		formData.append('theme', theme);
		if (logo) {
			formData.append('logo', logo);
		}
		return this.http.put<Institution>(this.api, formData).pipe(tap(() => this.bustImageCache()));
	}

	downloadUserCreationDefault(extension: 'csv' | 'xlsx'): Observable<Blob> {
		return this.http.get(`${this.api}/user-creation-file/${extension}`, { responseType: 'blob' });
	}

	createUsersFromFile(id: string, file: File): Observable<MultipleUserCreationResult> {
		const formData = new FormData();
		formData.append('file', file);
		return this.http.post<MultipleUserCreationResult>(`${this.api}/create-users/${id}`, formData);
	}
}
