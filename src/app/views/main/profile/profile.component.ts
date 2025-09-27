import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { LinkAccountPopUpComponent } from '../../../components/pop-ups/link-account-pop-up/link-account-pop-up.component';
import { User, UserAccount } from '../../../models/User';
import { AuthService } from '../../../services/auth.service';
import { ContextService } from '../../../services/context.service';
import { ThemeService } from '../../../services/theme.service';
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
		DividerModule,
		RouterModule,
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
	theme: ThemeService = inject(ThemeService);
	route: ActivatedRoute = inject(ActivatedRoute);
	isLoading: boolean = false;
	picture?: File;
	picturePreview: string | ArrayBuffer | null = null;
	form: FormGroup = this.formBuilder.group({});
	userId?: string;
	user?: User;
	readonly MAX_IMAGE_SIZE: number = environment.MAX_IMAGE_SIZE;

	ngOnInit() {
		// This is used to update the data when the userId changes in the URL
		this.route.params.subscribe(params => {
			const urlSegments = this.router.url.split('/');
			this.userId = urlSegments.length > 2 ? urlSegments[2] : undefined;
			this.getUserData();
		});
	}

	goBack() {
		if (this.ctx.institution?.id) {
			this.router.navigate(['/i', this.ctx.institution.id]);
		} else {
			this.router.navigate(['/']);
		}
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
		if (this.getFormControl('name').value === this.ctx.user?.name && this.picture === undefined) {
			return true;
		}
		return false;
	}

	get sortedAccounts(): UserAccount[] {
		if (!this.user?.accounts) {
			return [];
		}
		return this.user?.accounts.sort((a, b) => a.email.localeCompare(b.email));
	}

	get profilePictureUrl(): string {
		return this.service.getProfilePictureUrl(this.user!);
	}

	async getUserData() {
		if (this.self) {
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

	selectProfilePicture(event: FileSelectEvent) {
		this.picture = event.currentFiles[0];
		if (this.picture) {
			const reader = new FileReader();
			reader.onload = () => {
				this.picturePreview = reader.result;
			};
			reader.readAsDataURL(this.picture);
		}
	}

	resetForm() {
		this.form = this.formBuilder.group({
			name: [this.user?.name, Validators.required],
		});
		this.picture = undefined;
	}

	linkAccount() {
		this.dialog
			.open(LinkAccountPopUpComponent)
			.afterClosed()
			.subscribe((result: User) => {
				if (result) {
					this.ctx.user = result;
					this.getUserData();
					this.resetForm();
				}
			});
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;
			await lastValueFrom(this.service.update(this.getFormControl('name').value, this.picture))
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
