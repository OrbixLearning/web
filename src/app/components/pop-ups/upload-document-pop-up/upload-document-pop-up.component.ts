import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { Syllabus } from '../../../models/Syllabus';
import { ContextService } from '../../../services/context.service';
import { SyllabusComponent } from '../../syllabus/syllabus.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

export type UploadDocumentPopUpResponse = {
	name: string;
	syllabusIds: string[];
	file: File;
};

@Component({
	selector: 'o-upload-document-pop-up',
	imports: [
		PopUpHeaderComponent,
		PopUpButtonsComponent,
		SyllabusComponent,
		MatFormFieldModule,
		ReactiveFormsModule,
		FileUploadModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
	],
	templateUrl: './upload-document-pop-up.component.html',
	styleUrl: './upload-document-pop-up.component.scss',
})
export class UploadDocumentPopUpComponent {
	dialogRef: MatDialogRef<UploadDocumentPopUpComponent> = inject(MatDialogRef<UploadDocumentPopUpComponent>);
	formBuilder: FormBuilder = inject(FormBuilder);
	ctx: ContextService = inject(ContextService);

	form = this.formBuilder.group({
		name: ['', Validators.required],
		file: this.formBuilder.control<File | undefined>(undefined, Validators.required),
		syllabus: this.formBuilder.control<Syllabus[]>([]),
	});

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	markSyllabus(syllabus: Syllabus[]) {
		this.getFormControl('syllabus').setValue(syllabus);
	}

	selectFile(event: FileSelectEvent) {
		this.getFormControl('file').setValue(event.currentFiles[0]);
	}

	removeFile() {
		this.getFormControl('file').setValue(undefined);
	}

	onSubmit() {
		if (this.form.valid) {
			const response: UploadDocumentPopUpResponse = {
				name: this.getFormControl('name').value,
				syllabusIds: (this.getFormControl('syllabus').value as Syllabus[]).map(s => s.id!),
				file: this.getFormControl('file').value,
			};
			this.dialogRef.close(response);
		}
	}
}
