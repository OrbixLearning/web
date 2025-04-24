import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { AccountCardComponent } from '../../../components/account-card/account-card.component';
import { GameCardComponent } from '../../../components/game-card/game-card.component';
import { LinkAccountPopUpComponent } from '../../../components/link-account-pop-up/link-account-pop-up.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { InstitutionRoleEnum } from '../../../enums/InstitutionRole.enum';
import { User } from '../../../models/User';
import { AuthService } from '../../../services/auth.service';
import { ContextService } from '../../../services/context.service';
import { UserService } from '../../../services/user.service';

@Component({
	selector: 'o-profile',
	imports: [
		MatFormFieldModule,
		MatInputModule,
		FileUploadModule,
		MatButtonModule,
		MatIconModule,
		LoadingComponent,
		ReactiveFormsModule,
		AccountCardComponent,
		GameCardComponent,
	],
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
})
export class ProfileComponent {
	ctx: ContextService = inject(ContextService);
	service: UserService = inject(UserService);
	authService: AuthService = inject(AuthService);
	formBuilder: FormBuilder = inject(FormBuilder);
	router: Router = inject(Router);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	picture?: File;
	form: FormGroup = this.formBuilder.group({});
	userId?: string;
	user?: User;
	creatorEnum: InstitutionRoleEnum = InstitutionRoleEnum.CREATOR;

	constructor() {
		const urlSegments = this.router.url.split('/');
		this.userId = urlSegments.length > 2 ? urlSegments[2] : undefined;
	}

	ngOnInit() {
		this.getUserData();
	}

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	get self(): boolean {
		return this.ctx.user?.id === this.userId;
	}

	get disableSaveButton(): boolean {
		if (this.isLoading) {
			return true;
		}
		if (this.form.invalid) {
			return true;
		}
		if (
			this.getFormControl('firstName').value === this.ctx.user?.firstName &&
			this.getFormControl('surName').value === this.ctx.user?.surName &&
			this.picture === undefined
		) {
			return true;
		}
		return false;
	}

	async getUserData() {
		if (self) {
			this.user = this.ctx.user;
		} else {
			this.isLoading = true;
			await lastValueFrom(this.service.get(this.userId!))
				.then((u: User) => {
					this.user = u;
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
		this.resetForm();
	}

	resetForm() {
		this.form = this.formBuilder.group({
			firstName: [this.user?.firstName, Validators.required],
			surName: [this.user?.surName, Validators.required],
		});
		this.picture = undefined;
	}

	linkAccount() {
		this.dialog
			.open(LinkAccountPopUpComponent)
			.afterClosed()
			.subscribe((result: User) => {
				if (result) {
					this.ctx.user = this.user;
					this.getUserData();
					this.resetForm();
				}
			});
	}

	async logout() {
		await lastValueFrom(this.authService.logout()).then(() => {
			this.router.navigate(['/login']);
		});
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;
			await lastValueFrom(
				this.service.update(this.getFormControl('firstName').value, this.getFormControl('surName').value),
			)
				.then((user: User) => {
					this.ctx.user = user;
					this.getUserData();
					this.resetForm();
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}
}
