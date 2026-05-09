import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FileUploadModule } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Institution, InstitutionStyle } from '../../models/Institution';
import { ContextService } from '../../services/context.service';
import { InstitutionService } from '../../services/institution.service';
import { ThemeService } from '../../services/theme.service';
import { HighlightButtonComponent } from '../buttons/highlight-button/highlight-button.component';
import { TextButtonComponent } from '../buttons/text-button/text-button.component';
import { ImagePickerComponent } from '../image-picker/image-picker.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
	selector: 'o-white-label-configuration',
	imports: [
		TextButtonComponent,
		ImagePickerComponent,
		ReactiveFormsModule,
		MatButtonModule,
		MatSelectModule,
		MatIconModule,
		MatInputModule,
		MatFormFieldModule,
		ColorPickerModule,
		FileUploadModule,
		LoadingComponent,
		HighlightButtonComponent,
	],
	templateUrl: './white-label-configuration.component.html',
	styleUrl: './white-label-configuration.component.scss',
})
export class WhiteLabelConfigurationComponent {
	formBuilder: FormBuilder = inject(FormBuilder);
	service: InstitutionService = inject(InstitutionService);
	theme: ThemeService = inject(ThemeService);
	ctx: ContextService = inject(ContextService);

	form: FormGroup = this.formBuilder.group({});
	isLoading: boolean = false;
	logo?: File;
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
}
