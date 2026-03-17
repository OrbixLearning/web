import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom } from 'rxjs';
import { UserAIPreferences } from '../../models/User';
import { ContextService } from '../../services/context.service';
import { UserService } from '../../services/user.service';
import { HighlightButtonComponent } from '../buttons/highlight-button/highlight-button.component';
import { TextButtonComponent } from '../buttons/text-button/text-button.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
	selector: 'o-aipreferences-form',
	imports: [
		MatFormFieldModule,
		LoadingComponent,
		ReactiveFormsModule,
		TextButtonComponent,
		HighlightButtonComponent,
		MatSelectModule,
	],
	templateUrl: './aipreferences-form.component.html',
	styleUrl: './aipreferences-form.component.scss',
})
export class AIPreferencesFormComponent {
	ctx: ContextService = inject(ContextService);
	formBuilder: FormBuilder = inject(FormBuilder);
	service: UserService = inject(UserService);

	form = this.formBuilder.group({
		aiAnswerSize: ['', Validators.required],
		formality: ['', Validators.required],
		learningPathsDefaultLanguage: ['', Validators.required],
	});
	isLoading: boolean = false;

	get disableSaveButton(): boolean {
		if (this.isLoading) {
			return true;
		}
		if (this.form.invalid) {
			return true;
		}
		if (
			this.getFormControl('aiAnswerSize').value === this.ctx.user?.aiPreferences?.aiAnswerSize &&
			this.getFormControl('formality').value === this.ctx.user?.aiPreferences?.formality &&
			this.getFormControl('learningPathsDefaultLanguage').value ===
				this.ctx.user?.aiPreferences?.learningPathsDefaultLanguage
		) {
			return true;
		}
		return false;
	}

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	ngOnInit() {
		this.getData().then(() => this.resetForm());
	}

	async getData() {
		this.isLoading = true;
		await lastValueFrom(this.service.getUserAIPreferences())
			.then((prefs: UserAIPreferences) => {
				this.ctx.user!.aiPreferences = prefs;
			})
			.finally(() => (this.isLoading = false));
	}

	resetForm() {
		this.form.patchValue({
			aiAnswerSize: this.ctx.user?.aiPreferences?.aiAnswerSize,
			formality: this.ctx.user?.aiPreferences?.formality,
			learningPathsDefaultLanguage: this.ctx.user?.aiPreferences?.learningPathsDefaultLanguage,
		});
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;
			const aiPreferences: UserAIPreferences = {
				aiAnswerSize: this.form.value.aiAnswerSize!,
				formality: this.form.value.formality!,
				learningPathsDefaultLanguage: this.form.value.learningPathsDefaultLanguage!,
			};
			await lastValueFrom(this.service.updateAIPreferences(aiPreferences))
				.then((prefs: UserAIPreferences) => {
					this.ctx.user!.aiPreferences = prefs;
				})
				.finally(() => (this.isLoading = false));
		}
	}
}
