import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  api: string = `${environment.API_URL}/classroom`;
  http: HttpClient = inject(HttpClient);
}
