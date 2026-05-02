import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { HighlightButtonComponent } from '../../../../components/buttons/highlight-button/highlight-button.component';
import { TextButtonComponent } from '../../../../components/buttons/text-button/text-button.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { SyllabusEditorComponent } from '../../../../components/syllabus-editor/syllabus-editor.component';
import { Classroom } from '../../../../models/Classroom';
import { ClassroomService } from '../../../../services/classroom.service';
import { ContextService } from '../../../../services/context.service';

@Component({
	selector: 'o-classroom-settings',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		LoadingComponent,
		MatIconModule,
		RouterModule,
		DividerModule,
		FileUploadModule,
		TextButtonComponent,
		HighlightButtonComponent,
		SubHeaderComponent,
		SyllabusEditorComponent,
	],
	templateUrl: './classroom-settings.component.html',
	styleUrl: './classroom-settings.component.scss',
})
export class ClassroomSettingsComponent {
	ctx: ContextService = inject(ContextService);
	formBuilder: FormBuilder = inject(FormBuilder);
	service: ClassroomService = inject(ClassroomService);

	isLoading: boolean = false;
	form: FormGroup = this.formBuilder.group({});

	ngOnInit() {
		this.resetForm();
	}

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	get disableInfosSaveButton(): boolean {
		if (this.isLoading) {
			return true;
		}
		if (this.form.invalid) {
			return true;
		}
		if (
			this.getFormControl('name').value === this.ctx.classroom?.name &&
			this.getFormControl('icon').value === this.ctx.classroom?.icon
		) {
			return true;
		}
		return false;
	}

	resetForm() {
		this.form = this.formBuilder.group({
			name: [this.ctx.classroom?.name, Validators.required],
			icon: [this.ctx.classroom?.icon, Validators.required],
		});
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;
			await lastValueFrom(
				this.service.update(
					this.ctx.classroom!.id,
					this.getFormControl('name').value,
					this.getFormControl('icon').value,
				),
			)
				.then(async (c: Classroom) => {
					await this.ctx.loadClassroomList().then(() => {
						this.ctx.classroom = c;
					});
				})
				.finally(() => {
					this.isLoading = false;
				});
		}
	}
}
