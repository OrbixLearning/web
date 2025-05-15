import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

	get(id: string): Observable<User> {
		return this.http.get<User>(`${this.api}/${id}`);
	}

	getAmountOfClassroomsInInstitution(id: string): Observable<number> {
		return this.http.get<number>(`${this.api}/classrooms-amount/${id}`);
	}

	update(name: string): Observable<User> {
		return this.http.put<User>(this.api, { name });
	}

	updateUserInstitutionRole(id: string, role: InstitutionRoleEnum): Observable<UserAccount> {
		return this.http.put<UserAccount>(`${this.api}/institution-role`, { id, role });
	}

	deleteUserAccounts(ids: string[]): Observable<void> {
		return this.http.put<void>(`${this.api}/delete-accounts`, { ids });
	}

	resetUserAccountPassword(id: string, password: string): Observable<void> {
		return this.http.put<void>(`${this.api}/account-password-reset`, { id, password });
	}

	createInstitutionalAccount(
		email: string,
		name: string,
		password: string,
		institutionId: string,
		role: InstitutionRoleEnum,
		idInInstitution: string,
	): Observable<UserAccount> {
		return this.http.post<UserAccount>(this.api, {
			email,
			name,
			password,
			institutionId,
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
		roleFilter: InstitutionRoleEnum,
	): Observable<Page<UserAccount>> {
		let params = new HttpParams()
			.set('page', page)
			.set('size', size)
			.set('idInInstitution', idInInstitutionFilter)
			.set('email', emailFilter)
			.set('name', nameFilter)
			.set('role', roleFilter);

		return this.http.get<Page<UserAccount>>(`${this.api}/institution/${institutionId}`, { params });
	}

	getClassroomStudents(classroomId: string): Observable<UserAccount[]> {
		return this.http.get<UserAccount[]>(`${this.api}/classroom/${classroomId}/students`);
	}

	getClassroomTeachers(classroomId: string): Observable<UserAccount[]> {
		return this.http.get<UserAccount[]>(`${this.api}/classroom/${classroomId}/teachers`);
	}
}
