import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import {
	ErrorPopUpComponent,
	ErrorPopUpData,
} from '../../../../components/pop-ups/error-pop-up/error-pop-up.component';
import { User } from '../../../../models/User';
import { AuthService } from '../../../../services/auth.service';
import { ContextService } from '../../../../services/context.service';
import { MatIconModule } from '@angular/material/icon';
import { TextButtonComponent } from '../../../../components/buttons/text-button/text-button.component';

@Component({
	selector: 'o-link-account-callback',
	imports: [MatIconModule, TextButtonComponent],
	templateUrl: './link-account-callback.component.html',
	styleUrl: './link-account-callback.component.scss',
})
export class LinkAccountCallbackComponent {
	route: ActivatedRoute = inject(ActivatedRoute);
	service: AuthService = inject(AuthService);
	router: Router = inject(Router);
	dialog: MatDialog = inject(MatDialog);
	ctx: ContextService = inject(ContextService);

	constructor() {
		this.route.queryParams.subscribe(params => {
			let urlParams = new URLSearchParams(params);
			this.confirmAccountLink().then(confirmed => {
				if (confirmed) {
					this.oAuthAccountLinkProcess(urlParams);
				} else {
					this.goToProfile();
				}
			});
		});
	}

	async confirmAccountLink(): Promise<Observable<any>> {
		let data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja vincular sua conta?',
			message: 'Essa ação não pode ser desfeita.',
			confirmButton: 'Vincular conta',
		};
		return await lastValueFrom(this.dialog.open(ConfirmPopUpComponent, { data }).afterClosed());
	}

	async oAuthAccountLinkProcess(urlParams: URLSearchParams) {
		let code = urlParams.get('code');
		if (code) {
			await lastValueFrom(this.service.oAuthLinkAccount(code, environment.ACCOUNT_LINK_REDIRECT_URI))
				.then((user: User) => {
					this.ctx.user = user;
				})
				.finally(() => {
					this.goToProfile();
				});
		} else {
			this.errorAlert();
		}
	}

	errorAlert() {
		let data: ErrorPopUpData = {
			code: 500,
			message: 'Houve um erro ao tentar vincular sua conta Google. Por favor, tente novamente mais tarde.',
		};
		this.dialog
			.open(ErrorPopUpComponent, {
				data: data,
			})
			.afterClosed()
			.subscribe(() => {
				this.goToProfile();
			});
	}

	goToProfile() {
		if (this.ctx.user) {
			this.router.navigate(['/profile/' + this.ctx.user.id]);
		} else {
			this.router.navigate(['/']);
		}
	}
}
