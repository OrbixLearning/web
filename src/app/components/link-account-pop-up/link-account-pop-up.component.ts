import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { lastValueFrom } from 'rxjs';
import { User, UserAccount } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { ConfirmPopUpComponent } from '../confirm-pop-up/confirm-pop-up.component';
import { LoadingComponent } from '../loading/loading.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

@Component({
	selector: 'o-link-account-pop-up',
	imports: [
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		ReactiveFormsModule,
		LoadingComponent,
		PopUpHeaderComponent,
		MatFormFieldModule,
	],
	templateUrl: './link-account-pop-up.component.html',
	styleUrl: './link-account-pop-up.component.scss',
})
export class LinkAccountPopUpComponent {
	dialogRef: MatDialogRef<LinkAccountPopUpComponent> = inject(MatDialogRef);
	formBuilder: FormBuilder = inject(FormBuilder);
	service: AuthService = inject(AuthService);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	error: string = '';
	form = this.formBuilder.group({
		email: ['', Validators.required],
		password: ['', Validators.required],
	});
	hidePassword: boolean = true;

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;
			await lastValueFrom(this.service.validateAccountLink(this.getFormControl('email').value))
				.then((auth: UserAccount) => {
					this.dialog
						.open(ConfirmPopUpComponent, {
							data: {
								title: `Deseja confirmar o vínculo da conta ${auth.email} à esta conta?`,
								message: 'Essa ação não pode ser desfeita.',
							},
						})
						.afterClosed()
						.subscribe(async r => {
							if (r) {
								await this.linkAccount();
							} else {
								this.form.reset();
							}
						});
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}

	async linkAccount() {
		this.isLoading = true;
		await lastValueFrom(
			this.service.linkAccount(this.getFormControl('email').value, this.getFormControl('password').value),
		)
			.then((user: User) => {
				this.dialogRef.close(user);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async linkWithGoogle() {
		this.isLoading = true;
		await this.service
			.getGoogleOAuthURL(true)
			.then((url: string) => {
				window.location.href = url;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
