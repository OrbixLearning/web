import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { InstitutionRoleEnum } from '../enums/InstitutionRole.enum';
import { Page } from '../models/Page';
import { User, UserAccount } from '../models/User';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	api: string = `${environment.API_URL}/user`;
	http: HttpClient = inject(HttpClient);
	imageCacheBuster: number = 0;

	get(id: string): Observable<User> {
		return this.http.get<User>(`${this.api}/${id}`);
	}

	getAmountOfClassroomsInInstitution(id: string): Observable<number> {
		return this.http.get<number>(`${this.api}/classrooms-amount/${id}`);
	}

	getProfilePictureUrl(userId: string): string {
		return `${this.api}/profilePicture/${userId}?v=${this.imageCacheBuster}`;
	}

	private bustImageCache() {
		this.imageCacheBuster++;
	}

	update(name: string, profilePicture: File | undefined): Observable<User> {
		const formData = new FormData();
		formData.append('name', name);
		if (profilePicture) {
			formData.append('profilePicture', profilePicture);
		}
		return this.http.put<User>(this.api, formData).pipe(tap(() => this.bustImageCache()));
	}

	updateAccount(
		id: string,
		email: string,
		idInInstitution: string,
		institutionRole: InstitutionRoleEnum,
	): Observable<UserAccount> {
		return this.http.put<UserAccount>(`${this.api}/account/${id}`, {
			email,
			idInInstitution,
			institutionRole,
		});
	}

	deleteUserAccounts(ids: string[]): Observable<void> {
		return this.http.put<void>(`${this.api}/delete-accounts`, { ids });
	}

	resetUserAccountPassword(id: string, password: string): Observable<void> {
		return this.http.put<void>(`${this.api}/account-password-reset/${id}`, { password });
	}

	createInstitutionalAccount(
		institutionId: string,
		email: string,
		name: string,
		password: string,
		role: InstitutionRoleEnum,
		idInInstitution: string,
	): Observable<UserAccount> {
		return this.http.post<UserAccount>(`${this.api}/${institutionId}`, {
			email,
			name,
			password,
			role,
			idInInstitution,
		});
	}

	getInstitutionUsers(
		institutionId: string,
		page: number,
		size: number,
		idInInstitutionFilter: string,
		emailFilter: string,
		nameFilter: string,
		roleFilter?: InstitutionRoleEnum,
	): Observable<Page<UserAccount>> {
		let params = new HttpParams()
			.set('page', page)
			.set('size', size)
			.set('idInInstitution', idInInstitutionFilter)
			.set('email', emailFilter)
			.set('name', nameFilter)
			.set('role', roleFilter ? roleFilter : '');

		return this.http.get<Page<UserAccount>>(`${this.api}/institution/${institutionId}`, { params });
	}

	getUsersToAddToClassroom(classroomId: string, filter?: string): Observable<UserAccount[]> {
		let params = new HttpParams().set('filter', filter ? filter : '');
		return this.http.get<UserAccount[]>(`${this.api}/classroom/${classroomId}/add-to-classroom`, { params });
	}

	getClassroomStudents(classroomId: string): Observable<UserAccount[]> {
		return this.http.get<UserAccount[]>(`${this.api}/classroom/${classroomId}/students`);
	}

	getClassroomTeachers(classroomId: string): Observable<UserAccount[]> {
		return this.http.get<UserAccount[]>(`${this.api}/classroom/${classroomId}/teachers`);
	}
}
