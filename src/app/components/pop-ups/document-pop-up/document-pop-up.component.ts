import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '../../../../environments/environment';
import { DocumentAIUploadStatusEnum } from '../../../enums/DocumentAIUploadStatus.enum';
import { Document } from '../../../models/Document';
import { Syllabus } from '../../../models/Syllabus';
import { ContextService } from '../../../services/context.service';
import { SyllabusComponent } from '../../syllabus/syllabus.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

export type UploadDocumentPopUpResponse = {
	name: string;
	syllabusIds: string[];
	feedAi: boolean;
	hidden: boolean;
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
		MatCheckboxModule,
		TooltipModule,
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
		feedAi: this.formBuilder.control<boolean>(false),
		hidden: this.formBuilder.control<boolean>(false),
	});
	editMode: boolean = this.data?.document !== undefined;
	readonly MAX_PDF_SIZE: number = environment.MAX_PDF_SIZE;

	get disableFeedAi(): boolean {
		return this.getFormControl('syllabus').value.length === 0;
	}

	ngOnInit() {
		if (this.editMode) {
			this.getFormControl('name').setValue(this.data!.document.name);
			this.getFormControl('file').setValidators([]);
			this.getFormControl('syllabus').setValue(this.data!.document.syllabus || []);
			this.getFormControl('feedAi').setValue(
				this.data!.document.aiStatus !== DocumentAIUploadStatusEnum.NOT_UPLOADED &&
					this.data!.document.syllabus?.length! > 0,
			);
			this.getFormControl('hidden').setValue(this.data!.document.hidden);
			if (this.data!.document.syllabus?.length === 0) {
				this.getFormControl('feedAi').disable();
			}
		} else {
			this.getFormControl('feedAi').disable();
		}
	}

	getFormControl(name: string): FormControl {
		return this.form.get(name) as FormControl;
	}

	markSyllabus(syllabus: Syllabus[]) {
		this.getFormControl('syllabus').setValue(syllabus);
		if (syllabus.length === 0) {
			this.getFormControl('feedAi').setValue(false);
		}
	}

	selectFile(event: FileSelectEvent) {
		this.getFormControl('file').setValue(event.currentFiles[0]);
		if (!this.getFormControl('name').value) {
			const lastDotIndex = event.currentFiles[0].name.lastIndexOf('.');
			const name =
				lastDotIndex !== -1
					? event.currentFiles[0].name.substring(0, lastDotIndex)
					: event.currentFiles[0].name;
			this.getFormControl('name').setValue(name);
		}
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
					hidden: this.getFormControl('hidden').value,
					syllabus: this.getFormControl('syllabus').value,
					classroom: this.data!.document.classroom,
				};
			} else {
				response = {
					name: this.getFormControl('name').value,
					syllabusIds: (this.getFormControl('syllabus').value as Syllabus[]).map(s => s.id!),
					feedAi: this.getFormControl('feedAi').value,
					hidden: this.getFormControl('hidden').value,
					file: this.getFormControl('file').value,
				};
			}

			this.dialogRef.close(response);
		}
	}
}
