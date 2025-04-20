import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ErrorPopUpComponent, ErrorPopUpData } from '../../../components/error-pop-up/error-pop-up.component';
import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'o-oauth-callback',
	imports: [MatCardModule],
	templateUrl: './oauth-callback.component.html',
	styleUrl: './oauth-callback.component.scss',
})
export class OAuthCallbackComponent {
	activatedRoute: ActivatedRoute = inject(ActivatedRoute);
	service: AuthService = inject(AuthService);
	router: Router = inject(Router);
	dialog: MatDialog = inject(MatDialog);

	constructor() {
		this.activatedRoute.queryParams.subscribe(params => {
			let urlParams = new URLSearchParams(params);
			this.oAuthLoginProcess(urlParams);
		});
	}

	async oAuthLoginProcess(urlParams: URLSearchParams) {
		try {
			let code = urlParams.get('code');
			if (code) {
				await lastValueFrom(this.service.oAuthLogin(code, environment.OAUTH_REDIRECT_URI)).then(() => {
					this.router.navigate(['/']);
				});
			} else {
				throw new Error('Missing code parameter.');
			}
		} catch (e) {
			this.errorAlert();
		}
	}

	errorAlert() {
		let data: ErrorPopUpData = {
			code: 500,
			message: 'Houve um erro ao tentar fazer login com o Google. Por favor, tente novamente mais tarde.',
		};
		this.dialog
			.open(ErrorPopUpComponent, {
				data: data,
			})
			.afterClosed()
			.subscribe(() => {
				this.router.navigate(['/login']);
			});
	}
}
