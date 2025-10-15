import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/Notification';
import { Page } from '../models/Page';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	api: string = `${environment.API_URL}/notification`;
	http: HttpClient = inject(HttpClient);

	get(page?: number, size?: number): Observable<Page<Notification>> {
		let params = new HttpParams();
		if (page !== undefined) params = params.set('page', page.toString());
		if (size !== undefined) params = params.set('size', size.toString());
		return this.http.get<Page<Notification>>(this.api, { params });
	}

	read(notificationIds: string[]): Observable<Notification> {
		return this.http.post<Notification>(`${this.api}/read`, { notificationIds });
	}

	deletes(): Observable<void> {
		return this.http.delete<void>(this.api);
	}

	delete(notificationId: string): Observable<void> {
		return this.http.delete<void>(`${this.api}/${notificationId}`);
	}
}
