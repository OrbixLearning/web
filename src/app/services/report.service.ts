import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportTypeEnum } from '../enums/ReportType.enum';
import { Report } from '../models/Report';

@Injectable({
	providedIn: 'root',
})
export class ReportService {
	api: string = `${environment.API_URL}/report`;
	http: HttpClient = inject(HttpClient);

	getUserReports(): Observable<Report[]> {
		return this.http.get<Report[]>(this.api);
	}

	create(title: string, description: string, type: ReportTypeEnum): Observable<Report> {
		return this.http.post<Report>(this.api, { title, description, type });
	}
}
