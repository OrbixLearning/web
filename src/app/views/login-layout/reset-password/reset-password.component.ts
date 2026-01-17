import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { SuccessPopUpComponent } from '../../../components/pop-ups/success-pop-up/success-pop-up.component';
import { AuthService } from '../../../services/auth.service';
import { SecurityUtils } from '../../../utils/Security.utils';

@Component({
	selector: 'o-reset-password',
	imports: [
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		LoadingComponent,
		MatIconModule,
	],
	templateUrl: './reset-password.component.html',
	styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
	route: ActivatedRoute = inject(ActivatedRoute);
	router: Router = inject(Router);
	formBuilder: FormBuilder = inject(FormBuilder);
	service: AuthService = inject(AuthService);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	forgotPasswordToken: string = '';
	form = this.formBuilder.group({
		password: ['', Validators.required],
		passwordConfirmation: ['', Validators.required],
	});
	error: string = '';
	hidePassword: boolean = true;
	hidePasswordConfirmation: boolean = true;

	constructor() {
		if (this.route.snapshot.paramMap.get('token') === null) {
			this.router.navigate(['/login']);
			return;
		}
		this.forgotPasswordToken = this.route.snapshot.paramMap.get('token')!;
	}

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	verifyPasswords(): boolean {
		const password = this.getFormControl('password').value;
		if (!SecurityUtils.isPasswordStrong(password)) {
			this.error =
				'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.';
			return false;
		}
		const passwordConfirmation = this.getFormControl('passwordConfirmation').value;
		if (password !== passwordConfirmation) {
			this.error = 'As senhas não coincidem.';
			return false;
		}
		return true;
	}

	async onSubmit() {
		if (this.form.valid && this.verifyPasswords()) {
			this.isLoading = true;
			await lastValueFrom(
				this.service.resetPassword(this.forgotPasswordToken, this.getFormControl('password').value),
			)
				.then(() => {
					this.dialog
						.open(SuccessPopUpComponent, {
							data: {
								title: 'Senha redefinida com sucesso!',
								message: 'Agora você pode fazer login com sua nova senha.',
							},
						})
						.afterClosed()
						.subscribe(() => {
							this.router.navigate(['/login']);
						});
				})
				.finally(() => {
					this.error = '';
					this.isLoading = false;
				});
		}
	}
}
