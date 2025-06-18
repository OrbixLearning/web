import { Component, inject } from '@angular/core';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { SyllabusComponent } from '../../syllabus/syllabus.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContextService } from '../../../services/context.service';
import { Syllabus } from '../../../models/Syllabus';
import { Document } from '../../../models/Document';
import { environment } from '../../../../environments/environment';

export type UploadDocumentPopUpResponse = {
	name: string;
	syllabusIds: string[];
	file: File;
};

@Component({
	selector: 'o-document-pop-up',
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
	templateUrl: './document-pop-up.component.html',
	styleUrl: './document-pop-up.component.scss',
})
export class DocumentPopUpComponent {
	dialogRef: MatDialogRef<DocumentPopUpComponent> = inject(MatDialogRef<DocumentPopUpComponent>);
	formBuilder: FormBuilder = inject(FormBuilder);
	ctx: ContextService = inject(ContextService);
	data: { document: Document } | undefined = inject(MAT_DIALOG_DATA);

	form = this.formBuilder.group({
		name: ['', Validators.required],
		file: this.formBuilder.control<File | undefined>(undefined, Validators.required),
		syllabus: this.formBuilder.control<Syllabus[]>([]),
	});
	editMode: boolean = this.data?.document !== undefined;
	readonly MAX_PDF_SIZE: number = environment.MAX_PDF_SIZE;

	ngOnInit() {
		if (this.editMode) {
			this.getFormControl('name').setValue(this.data!.document.name);
			this.getFormControl('file').setValidators([]);
			this.getFormControl('syllabus').setValue(this.data!.document.syllabus || []);
		}
	}

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
			let response: UploadDocumentPopUpResponse | Document | undefined = undefined;

			if (this.editMode) {
				response = {
					id: this.data!.document.id,
					name: this.getFormControl('name').value,
					extension: this.data!.document.extension,
					aiStatus: this.data!.document.aiStatus,
					syllabus: this.getFormControl('syllabus').value,
					classroom: this.data!.document.classroom,
				};
			} else {
				response = {
					name: this.getFormControl('name').value,
					syllabusIds: (this.getFormControl('syllabus').value as Syllabus[]).map(s => s.id!),
					file: this.getFormControl('file').value,
				};
			}

			this.dialogRef.close(response);
		}
	}
}
