import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { lastValueFrom } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { SecurityUtils } from '../../../utils/Security.utils';
import { LoadingComponent } from '../../loading/loading.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { SuccessPopUpComponent } from '../success-pop-up/success-pop-up.component';

@Component({
	selector: 'o-change-password-pop-up',
	imports: [
		MatDialogModule,
		PopUpButtonsComponent,
		PopUpHeaderComponent,
		LoadingComponent,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatInputModule,
		MatIconModule,
	],
	templateUrl: './change-password-pop-up.component.html',
	styleUrl: './change-password-pop-up.component.scss',
})
export class ChangePasswordPopUpComponent {
	data: { accountId: string; email: string } = inject(MAT_DIALOG_DATA);
	service: UserService = inject(UserService);
	formBuilder: FormBuilder = inject(FormBuilder);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	form = this.formBuilder.group({
		currentPassword: ['', Validators.required],
		newPassword: ['', Validators.required],
		newPasswordConfirmation: ['', Validators.required],
	});
	error: string = '';
	hideCurrentPassword: boolean = true;
	hideNewPassword: boolean = true;
	hideNewPasswordConfirmation: boolean = true;

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	verifyNewPassword(): boolean {
		const newPassword = this.getFormControl('newPassword').value;
		if (!SecurityUtils.isPasswordStrong(newPassword)) {
			this.error =
				'A nova senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.';
			return false;
		}
		const newPasswordConfirmation = this.getFormControl('newPasswordConfirmation').value;
		if (newPassword !== newPasswordConfirmation) {
			this.error = 'As senhas não coincidem.';
			return false;
		}
		return true;
	}

	async onSubmit() {
		if (this.form.valid && this.verifyNewPassword()) {
			this.isLoading = true;
			await lastValueFrom(
				this.service.changePassword(
					this.data.accountId,
					this.getFormControl('currentPassword').value,
					this.getFormControl('newPassword').value,
				),
			)
				.then(() => {
					this.dialog
						.open(SuccessPopUpComponent, {
							data: {
								title: `Senha de ${this.data.email} alterada com sucesso!`,
							},
						})
						.afterClosed()
						.subscribe(() => {
							this.dialog.closeAll();
						});
				})
				.finally(() => {
					this.error = '';
					this.isLoading = false;
				});
		}
	}
}
