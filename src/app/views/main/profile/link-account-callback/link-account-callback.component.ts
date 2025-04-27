import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
	ErrorPopUpComponent,
	ErrorPopUpData,
} from '../../../../components/pop-ups/error-pop-up/error-pop-up.component';

@Component({
	selector: 'o-link-account-callback',
	imports: [],
	templateUrl: './link-account-callback.component.html',
	styleUrl: './link-account-callback.component.scss',
})
export class LinkAccountCallbackComponent {
	activatedRoute: ActivatedRoute = inject(ActivatedRoute);
	service: AuthService = inject(AuthService);
	router: Router = inject(Router);
	dialog: MatDialog = inject(MatDialog);

	// TODO: Refactor this component to link accounts instead of login

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
