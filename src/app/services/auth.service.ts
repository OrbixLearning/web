import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserAccount } from '../models/User';
import { ContextService } from './context.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	api: string = `${environment.API_URL}/auth`;
	googleOAuthUri: string = 'https://accounts.google.com/o/oauth2/v2/auth';
	http: HttpClient = inject(HttpClient);
	ctx: ContextService = inject(ContextService);

	auth(): Observable<User> {
		return this.http.get<User>(this.api);
	}

	login(email: string, password: string): Observable<any> {
		email = email.trim().toLowerCase();
		return this.http.post(`${this.api}/login`, { email, password });
	}

	register(firstName: string, surName: string, email: string, password: string): Observable<any> {
		email = email.trim().toLowerCase();
		return this.http.post(`${this.api}/register`, {
			firstName,
			surName,
			email,
			password,
		});
	}

	logout(): Observable<any> {
		this.ctx.clearUser();
		return this.http.get(`${this.api}/logout`);
	}

	forgotPassword(email: string): Observable<any> {
		email = email.trim().toLowerCase();
		return this.http.post(`${this.api}/forgot-password`, { email });
	}

	resetPassword(token: string, password: string): Observable<any> {
		return this.http.post(`${this.api}/reset-password`, { token, password });
	}

	getGoogleClientId(): Observable<{ clientId: string }> {
		return this.http.get<{ clientId: string }>(`${this.api}/google-client-id`);
	}

	async getGoogleOAuthURL(linkAccount: boolean = false): Promise<string> {
		let googleClientId = (await lastValueFrom(this.getGoogleClientId())).clientId;
		let params = new URLSearchParams();
		params.append('client_id', googleClientId);
		params.append(
			'redirect_uri',
			linkAccount ? environment.ACCOUNT_LINK_REDIRECT_URI : environment.OAUTH_REDIRECT_URI,
		);
		params.append('response_type', 'code');
		params.append('scope', 'email profile');
		return `${this.googleOAuthUri}?${params.toString()}`;
	}

	oAuthLogin(code: string, redirectUri: string): Observable<any> {
		return this.http.post(`${this.api}/oauth-login`, { code, redirectUri });
	}

	validateAccountLink(email: string): Observable<UserAccount> {
		email = email.trim().toLowerCase();
		return this.http.post<UserAccount>(`${this.api}/validate-account-link`, { email });
	}

	linkAccount(email: string, password: string): Observable<User> {
		email = email.trim().toLowerCase();
		return this.http.post<User>(`${this.api}/link-account`, { email, password });
	}
}
