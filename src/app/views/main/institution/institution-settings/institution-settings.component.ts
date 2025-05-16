import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FileUploadModule } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { Institution } from '../../../../models/Institution';
import { ContextService } from '../../../../services/context.service';
import { InstitutionService } from '../../../../services/institution.service';
import { ThemeService } from '../../../../services/theme.service';

@Component({
	selector: 'o-institution-settings',
	imports: [
		ReactiveFormsModule,
		MatButtonModule,
		MatSelectModule,
		MatIconModule,
		MatInputModule,
		MatFormFieldModule,
		ColorPickerModule,
		FileUploadModule,
		LoadingComponent,
		RouterModule,
		FormsModule,
	],
	templateUrl: './institution-settings.component.html',
	styleUrl: './institution-settings.component.scss',
})
export class InstitutionSettingsComponent {
	formBuilder: FormBuilder = inject(FormBuilder);
	service: InstitutionService = inject(InstitutionService);
	ctx: ContextService = inject(ContextService);
	theme: ThemeService = inject(ThemeService);

	isLoading: boolean = false;
	form: FormGroup = this.formBuilder.group({});
	logo?: File;
	primaryColor: string = this.ctx.institution?.primaryColor || '#000000';
	secondaryColor: string = this.ctx.institution?.secondaryColor || '#000000';

	ngOnInit() {
		this.resetForm();
	}

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	get usersUrl(): string {
		return '/i/' + this.ctx.institution?.id + '/users';
	}

	get classroomsUrl(): string {
		return '/i/' + this.ctx.institution?.id + '/classrooms';
	}

	get disableSaveButton(): boolean {
		if (this.isLoading) {
			return true;
		}
		if (this.form.invalid) {
			return true;
		}
		if (
			this.getFormControl('name').value === this.ctx.institution?.name &&
			this.getFormControl('primaryColor').value === this.ctx.institution?.primaryColor &&
			this.getFormControl('secondaryColor').value === this.ctx.institution?.secondaryColor &&
			this.logo === undefined
		) {
			return true;
		}
		return false;
	}

	resetForm() {
		this.form = this.formBuilder.group({
			name: [this.ctx.institution?.name, Validators.required],
			primaryColor: [
				this.ctx.institution?.primaryColor,
				[Validators.required, Validators.pattern(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i)],
			],
			secondaryColor: [
				this.ctx.institution?.secondaryColor,
				[Validators.required, Validators.pattern(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i)],
			],
		});
		this.logo = undefined;
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;

			// TODO: Handle logo upload
			// institution.logo = this.logo;

			await lastValueFrom(
				this.service.update(
					this.ctx.institution!.id!,
					this.getFormControl('name').value,
					this.getFormControl('primaryColor').value,
					this.getFormControl('secondaryColor').value,
				),
			)
				.then((i: Institution) => {
					this.ctx.institution = i;
					this.resetForm();
					this.theme.setInstitutionTheme(this.ctx.institution);
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}
}
