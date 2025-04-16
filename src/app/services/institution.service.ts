import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  api: string = `${environment.API_URL}/institution`;
  http: HttpClient = inject(HttpClient);
}
