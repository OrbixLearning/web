import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom } from 'rxjs';
import { InstitutionRoleEnum } from '../../../enums/InstitutionRole.enum';
import { UserAccount } from '../../../models/User';
import { ContextService } from '../../../services/context.service';
import { UserService } from '../../../services/user.service';
import { LoadingComponent } from '../../loading/loading.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { SuccessPopUpComponent, SuccessPopUpData } from '../success-pop-up/success-pop-up.component';

@Component({
	selector: 'o-user-creation-pop-up',
	imports: [
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		ReactiveFormsModule,
		MatInputModule,
		MatFormFieldModule,
		MatSelectModule,
		LoadingComponent,
		MatIconModule,
	],
	templateUrl: './user-creation-pop-up.component.html',
	styleUrl: './user-creation-pop-up.component.scss',
})
export class UserCreationPopUpComponent {
	formBuilder: FormBuilder = inject(FormBuilder);
	service: UserService = inject(UserService);
	dialog: MatDialog = inject(MatDialog);
	dialogRef: MatDialogRef<UserCreationPopUpComponent> = inject(MatDialogRef);
	ctx: ContextService = inject(ContextService);

	isLoading: boolean = false;
	form: FormGroup = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
		name: ['', Validators.required],
		role: [InstitutionRoleEnum.STUDENT, Validators.required],
		idInInstitution: ['', Validators.required],
		password: ['', Validators.required],
		passwordConfirmation: ['', Validators.required],
	});
	error: string = '';
	hidePassword: boolean = true;
	hidePasswordConfirmation: boolean = true;
	roles: InstitutionRoleEnum[] = Object.values(InstitutionRoleEnum).filter(r => r !== InstitutionRoleEnum.CREATOR);

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
				this.service.createInstitutionalAccount(
					this.getFormControl('email').value,
					this.getFormControl('name').value,
					this.getFormControl('password').value,
					this.ctx.institution!.id!,
					this.getFormControl('role').value,
					this.getFormControl('idInInstitution').value,
				),
			)
				.then((account: UserAccount) => {
					if (account) {
						let data: SuccessPopUpData = {
							title: `Usuário ${account.email} criado com sucesso`,
						};
						this.dialog
							.open(SuccessPopUpComponent, { data })
							.afterClosed()
							.subscribe(() => {
								this.dialogRef.close(true);
							});
					}
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}
}
