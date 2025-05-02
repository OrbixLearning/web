import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { lastValueFrom } from 'rxjs';
import { Classroom } from '../../../models/Classroom';
import { ClassroomService } from '../../../services/classroom.service';
import { ContextService } from '../../../services/context.service';
import { LoadingComponent } from '../../loading/loading.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { SuccessPopUpComponent, SuccessPopUpData } from '../success-pop-up/success-pop-up.component';

@Component({
	selector: 'o-classroom-creation-pop-up',
	imports: [
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		ReactiveFormsModule,
		MatInputModule,
		MatFormFieldModule,
		LoadingComponent,
		MatIconModule,
	],
	templateUrl: './classroom-creation-pop-up.component.html',
	styleUrl: './classroom-creation-pop-up.component.scss',
})
export class ClassroomCreationPopUpComponent {
	formBuilder: FormBuilder = inject(FormBuilder);
	service: ClassroomService = inject(ClassroomService);
	dialog: MatDialog = inject(MatDialog);
	dialogRef: MatDialogRef<ClassroomCreationPopUpComponent> = inject(MatDialogRef);
	ctx: ContextService = inject(ContextService);

	isLoading: boolean = false;
	form: FormGroup = this.formBuilder.group({
		name: ['', Validators.required],
		icon: ['', Validators.required],
	});

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	async onSubmit() {
		if (this.form.valid) {
			this.isLoading = true;
			await lastValueFrom(
				this.service.create(
					this.ctx.institution!.id!,
					this.getFormControl('name').value,
					this.getFormControl('icon').value,
				),
			)
				.then((classroom: Classroom) => {
					if (classroom) {
						let data: SuccessPopUpData = {
							title: `Turma ${classroom.name} criada com sucesso`,
						};
						this.dialog
							.open(SuccessPopUpComponent, { data })
							.afterClosed()
							.subscribe(() => {
								this.ctx.classroomList?.push(classroom);
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
