import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InstitutionRoleEnum } from '../../../enums/InstitutionRole.enum';
import { UserAccount } from '../../../models/User';
import { InstitutionRolePipe } from '../../../pipes/institution-role.pipe';
import { ContextService } from '../../../services/context.service';
import { InstitutionService } from '../../../services/institution.service';
import { UserService } from '../../../services/user.service';
import { download } from '../../../utils/Download.util';
import { HighlightButtonComponent } from '../../buttons/highlight-button/highlight-button.component';
import { TextButtonComponent } from '../../buttons/text-button/text-button.component';
import { LoadingComponent } from '../../loading/loading.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { SuccessPopUpComponent, SuccessPopUpData } from '../success-pop-up/success-pop-up.component';
import { MultipleUserCreationErrorPopUpComponent } from './multiple-user-creation-error-pop-up/multiple-user-creation-error-pop-up.component';

export type MultipleUserCreationResult = {
	error: boolean;
	message: string;
	problematicUsers?: string[];
};

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
		InstitutionRolePipe,
		MatTabsModule,
		FileUploadModule,
		TextButtonComponent,
		HighlightButtonComponent,
	],
	templateUrl: './user-creation-pop-up.component.html',
	styleUrl: './user-creation-pop-up.component.scss',
})
export class UserCreationPopUpComponent {
	formBuilder: FormBuilder = inject(FormBuilder);
	service: UserService = inject(UserService);
	institutionService: InstitutionService = inject(InstitutionService);
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
	roles: InstitutionRoleEnum[] = Object.values(InstitutionRoleEnum);

	MAX_FILE_SIZE: number = environment.MAX_PDF_SIZE;
	usersDocument?: File;

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
					this.ctx.institution!.id!,
					this.getFormControl('email').value,
					this.getFormControl('name').value,
					this.getFormControl('password').value,
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

	async downloadDefaultXlsx() {
		this.isLoading = true;
		await lastValueFrom(this.institutionService.downloadUserCreationDefault('xlsx'))
			.then((blob: Blob) => {
				download(blob, 'CriacaoMultiplaUsuarios.xlsx');
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async downloadDefaultCsv() {
		this.isLoading = true;
		await lastValueFrom(this.institutionService.downloadUserCreationDefault('csv'))
			.then((blob: Blob) => {
				download(blob, 'CriacaoMultiplaUsuarios.csv');
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	selectUsersDocument(event: FileSelectEvent) {
		this.usersDocument = event.currentFiles[0];
	}

	async createUsersFromFile() {
		this.isLoading = true;
		await lastValueFrom(this.institutionService.createUsersFromFile(this.ctx.institution!.id!, this.usersDocument!))
			.then((result: MultipleUserCreationResult) => {
				let popUpRef: any;

				if (!result.error) {
					const data: SuccessPopUpData = {
						title: 'Usuários criados com sucesso!',
						message: 'Todos os usuários do arquivo foram criados com sucesso.',
					};
					popUpRef = this.dialog.open(SuccessPopUpComponent, {
						data,
					});
				} else {
					popUpRef = this.dialog.open(MultipleUserCreationErrorPopUpComponent, {
						data: {
							message: result.message,
							problematicUsers: result.problematicUsers,
						},
					});
				}

				popUpRef.afterClosed().subscribe(() => {
					this.dialogRef.close(true);
				});
			})
			.finally(() => {
				this.isLoading = false;
			});
	}
}
