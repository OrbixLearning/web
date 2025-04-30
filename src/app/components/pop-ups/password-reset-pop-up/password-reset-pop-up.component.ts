import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { lastValueFrom } from 'rxjs';
import { UserAccount } from '../../../models/User';
import { UserService } from '../../../services/user.service';
import { LoadingComponent } from '../../loading/loading.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

@Component({
	selector: 'o-password-reset-pop-up',
	imports: [
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		LoadingComponent,
	],
	templateUrl: './password-reset-pop-up.component.html',
	styleUrl: './password-reset-pop-up.component.scss',
})
export class PasswordResetPopUpComponent {
	data: UserAccount = inject(MAT_DIALOG_DATA);
	dialogRef: MatDialogRef<PasswordResetPopUpComponent> = inject(MatDialogRef);
	formBuilder: FormBuilder = inject(FormBuilder);
	userService: UserService = inject(UserService);

	isLoading: boolean = false;
	form = this.formBuilder.group({
		password: ['', Validators.required],
		passwordConfirmation: ['', Validators.required],
	});
	error: string = '';
	hidePassword: boolean = true;
	hidePasswordConfirmation: boolean = true;

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	verifyPasswords(): boolean {
		const password = this.getFormControl('password').value;
		const passwordConfirmation = this.getFormControl('passwordConfirmation').value;
		if (password !== passwordConfirmation) {
			this.error = 'As senhas não coincidem';
			return false;
		}
		return true;
	}

	async onSubmit() {
		if (this.form.valid && this.verifyPasswords()) {
			this.isLoading = true;
			await lastValueFrom(
				this.userService.resetUserAccountPassword(this.data.id, this.getFormControl('password').value),
			)
				.then(() => {
					this.dialogRef.close(true);
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}
}
