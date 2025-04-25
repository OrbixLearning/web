import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { DividerModule } from 'primeng/divider';
import { InputOtpModule } from 'primeng/inputotp';
import { lastValueFrom } from 'rxjs';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { LoadingComponent } from '../loading/loading.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { SuccessPopUpComponent } from '../success-pop-up/success-pop-up.component';

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
		InputOtpModule,
		DividerModule,
		MatStepperModule,
	],
	templateUrl: './link-account-pop-up.component.html',
	styleUrl: './link-account-pop-up.component.scss',
})
export class LinkAccountPopUpComponent {
	dialogRef: MatDialogRef<LinkAccountPopUpComponent> = inject(MatDialogRef);
	formBuilder: FormBuilder = inject(FormBuilder);
	service: AuthService = inject(AuthService);
	dialog: MatDialog = inject(MatDialog);

	@ViewChild('stepper') stepper?: MatStepper;

	form: FormGroup = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', Validators.required],
	});
	isLoading: boolean = false;
	hidePassword: boolean = true;
	error: string = '';

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;
			await lastValueFrom(
				this.service.sendLinkAccountCode(
					this.getFormControl('email').value,
					this.getFormControl('password').value,
				),
			)
				.then(() => {
					this.dialog
						.open(SuccessPopUpComponent, {
							data: {
								title: `Um email foi enviado para ${this.getFormControl('email').value}`,
								message: 'Verifique sua caixa de entrada, copie o código enviado e cole-o abaixo.',
								buttonText: 'Ok',
							},
						})
						.afterClosed()
						.subscribe(() => {
							this.stepper?.next();
						});
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}
}
