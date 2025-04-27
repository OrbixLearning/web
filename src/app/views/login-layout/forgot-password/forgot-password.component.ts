import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { SuccessPopUpComponent } from '../../../components/pop-ups/success-pop-up/success-pop-up.component';
import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'o-forgot-password',
	imports: [
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		LoadingComponent,
		RouterModule,
		MatIconModule,
	],
	templateUrl: './forgot-password.component.html',
	styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
	service: AuthService = inject(AuthService);
	formBuilder: FormBuilder = inject(FormBuilder);
	router: Router = inject(Router);
	dialog: MatDialog = inject(MatDialog);

	form = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
	});
	isLoading: boolean = false;
	error: string = '';

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;
			await lastValueFrom(this.service.forgotPassword(this.getFormControl('email').value))
				.then(() => {
					this.dialog
						.open(SuccessPopUpComponent, {
							data: {
								title: 'Um email foi enviado para redefinir sua senha!',
								message: 'Verifique sua caixa de entrada e siga as instruções.',
							},
						})
						.afterClosed()
						.subscribe(() => {
							this.router.navigate(['/']);
						});
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}
}
