import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api: string = `${environment.API_URL}/user`;
  http: HttpClient = inject(HttpClient);
}
