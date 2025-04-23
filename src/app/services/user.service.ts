import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/User';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	api: string = `${environment.API_URL}/user`;
	http: HttpClient = inject(HttpClient);

	get(id: string): Observable<User> {
		return this.http.get<User>(`${this.api}/${id}`);
	}
}
