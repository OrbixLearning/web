import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DividerModule } from 'primeng/divider';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { Institution, InstitutionStyle } from '../../../../models/Institution';
import { ContextService } from '../../../../services/context.service';
import { InstitutionService } from '../../../../services/institution.service';
import { ThemeService } from '../../../../services/theme.service';
import { HighlightButtonComponent } from '../../../../components/buttons/highlight-button/highlight-button.component';
import { TextButtonComponent } from '../../../../components/buttons/text-button/text-button.component';

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
		DividerModule,
		HighlightButtonComponent,
		TextButtonComponent,
	],
	templateUrl: './institution-settings.component.html',
	styleUrl: './institution-settings.component.scss',
})
export class InstitutionSettingsComponent {
	formBuilder: FormBuilder = inject(FormBuilder);
	service: InstitutionService = inject(InstitutionService);
	ctx: ContextService = inject(ContextService);
	theme: ThemeService = inject(ThemeService);
	router: Router = inject(Router);

	isLoading: boolean = false;
	form: FormGroup = this.formBuilder.group({});
	logo?: File;
	logoPreview: string | ArrayBuffer | null = null;
	initialStyle: InstitutionStyle = this.ctx.institution?.style!;
	readonly MAX_IMAGE_SIZE: number = environment.MAX_IMAGE_SIZE;

	ngOnInit() {
		this.resetForm();
	}

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
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
			this.getFormControl('primaryColor').value === this.initialStyle.primaryColor &&
			this.getFormControl('secondaryColor').value === this.initialStyle.secondaryColor &&
			this.getFormControl('backgroundColor').value === this.initialStyle.backgroundColor &&
			this.getFormControl('textColor').value === this.initialStyle.textColor &&
			this.getFormControl('theme').value === this.initialStyle.theme &&
			this.logo === undefined
		) {
			return true;
		}
		return false;
	}

	get logoUrl(): string {
		return this.service.getLogoUrl(this.ctx.institution?.id!);
	}

	resetForm() {
		this.form = this.formBuilder.group({
			name: [this.ctx.institution?.name, Validators.required],
			primaryColor: [
				this.ctx.institution?.style!.primaryColor,
				[Validators.required, Validators.pattern(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i)],
			],
			secondaryColor: [
				this.ctx.institution?.style!.secondaryColor,
				[Validators.required, Validators.pattern(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i)],
			],
			backgroundColor: [
				this.ctx.institution?.style!.backgroundColor,
				[Validators.required, Validators.pattern(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i)],
			],
			textColor: [
				this.ctx.institution?.style!.textColor,
				[Validators.required, Validators.pattern(/^#([0-9A-F]{3}|[0-9A-F]{6})$/i)],
			],
			theme: [this.ctx.institution?.style!.theme, Validators.required],
		});
		this.logo = undefined;
	}

	selectLogo(event: FileSelectEvent) {
		this.logo = event.currentFiles[0];
		if (this.logo) {
			const reader = new FileReader();
			reader.onload = () => {
				this.logoPreview = reader.result;
			};
			reader.readAsDataURL(this.logo);
		}
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;
			await lastValueFrom(
				this.service.update(
					this.ctx.institution!.id!,
					this.getFormControl('name').value,
					this.logo,
					this.getFormControl('primaryColor').value,
					this.getFormControl('secondaryColor').value,
					this.getFormControl('backgroundColor').value,
					this.getFormControl('textColor').value,
					this.getFormControl('theme').value,
				),
			)
				.then((i: Institution) => {
					this.ctx.institution = i;
					this.initialStyle = i.style!;
					this.resetForm();
					this.theme.setInstitutionTheme(this.ctx.institution);
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}

	goToUsers() {
		this.router.navigate(['/i/' + this.ctx.institution?.id + '/users']);
	}

	goToClassrooms() {
		this.router.navigate(['/i/' + this.ctx.institution?.id + '/classrooms']);
	}
}
