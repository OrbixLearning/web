import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DocumentAIUploadStatusEnum } from '../../../enums/DocumentAIUploadStatus.enum';
import { DocumentTypeEnum } from '../../../enums/DocumentType.enum';
import { Document } from '../../../models/Document';
import { Syllabus } from '../../../models/Syllabus';
import { DocumentTypePipe } from '../../../pipes/document-type.pipe';
import { ContextService } from '../../../services/context.service';
import { SyllabusComponent } from '../../syllabus/syllabus.component';
import { ConfirmPopUpComponent, ConfirmPopUpData } from '../confirm-pop-up/confirm-pop-up.component';
import { ErrorPopUpComponent, ErrorPopUpData } from '../error-pop-up/error-pop-up.component';
import { PopUpButtonsComponent } from '../pop-up-buttons/pop-up-buttons.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

export type UploadDocumentPopUpResponse = {
	name: string;
	syllabusIds: string[];
	feedAi: boolean;
	hidden: boolean;
	type: DocumentTypeEnum;
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
		MatSelectModule,
		DocumentTypePipe,
	],
	templateUrl: './document-pop-up.component.html',
	styleUrl: './document-pop-up.component.scss',
})
export class DocumentPopUpComponent {
	dialog: MatDialog = inject(MatDialog);
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
		type: this.formBuilder.control<DocumentTypeEnum>(DocumentTypeEnum.OTHER, Validators.required),
	});
	editMode: boolean = this.data?.document !== undefined;
	types: DocumentTypeEnum[] = Object.values(DocumentTypeEnum);

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
			this.getFormControl('type').setValue(this.data!.document.type);
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
		const file = event.currentFiles[0];
		if (file.size > environment.MAX_PDF_SIZE) {
			const data: ErrorPopUpData = {
				code: 413,
				message: `O tamanho do arquivo excede o limite máximo de ${environment.MAX_PDF_SIZE / 1048576} MB.`,
				buttonText: 'Ok',
			};
			this.dialog.open(ErrorPopUpComponent, { data });
		} else {
			this.getFormControl('file').setValue(file);
			if (!this.getFormControl('name').value) {
				const lastDotIndex = file.name.lastIndexOf('.');
				const name = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name;
				this.getFormControl('name').setValue(name);
			}
		}
	}

	removeFile() {
		this.getFormControl('file').setValue(undefined);
	}

	isQuestionDocumentType(type: DocumentTypeEnum): boolean {
		return type === DocumentTypeEnum.EXERCISE || type === DocumentTypeEnum.PAST_EXAM;
	}

	async warnDocumentTypeChange(): Promise<boolean> {
		const oldType = this.data!.document.type;
		const newType = this.getFormControl('type').value as DocumentTypeEnum;
		if (oldType !== newType) {
			let data: ConfirmPopUpData | undefined = undefined;
			if (this.isQuestionDocumentType(oldType) && !this.isQuestionDocumentType(newType)) {
				data = {
					title: 'Você está alterando o tipo do documento para um tipo que não gera questões. Tem certeza que deseja continuar?',
					message: 'As questões geradas relacionadas a este documento serão removidas.',
				};
			} else if (!this.isQuestionDocumentType(oldType) && this.isQuestionDocumentType(newType)) {
				data = {
					title: 'Você está alterando o tipo do documento para um tipo que gera questões. Tem certeza que deseja continuar?',
					message:
						'O conteúdo do documento será quebrado em questões automaticamente pela IA. Informações que não sejam questões serão desconsideradas.',
				};
			}
			if (data) {
				const confirmation = !!(await lastValueFrom(
					this.dialog.open(ConfirmPopUpComponent, { data }).afterClosed(),
				));
				return confirmation;
			}
		}
		return true;
	}

	async onSubmit() {
		if (this.form.valid) {
			let response: UploadDocumentPopUpResponse | Document | undefined = undefined;

			if (this.editMode) {
				const typeWarnConfirmation = await this.warnDocumentTypeChange();
				if (!typeWarnConfirmation) return;

				response = {
					id: this.data!.document.id,
					name: this.getFormControl('name').value,
					extension: this.data!.document.extension,
					aiStatus: this.data!.document.aiStatus,
					hidden: this.getFormControl('hidden').value,
					type: this.getFormControl('type').value,
					syllabus: this.getFormControl('syllabus').value,
					classroom: this.data!.document.classroom,
					questions: this.data!.document.questions,
					questionsValidated: this.data!.document.questionsValidated,
				};
			} else {
				response = {
					name: this.getFormControl('name').value,
					syllabusIds: (this.getFormControl('syllabus').value as Syllabus[]).map(s => s.id!),
					feedAi: this.getFormControl('feedAi').value,
					hidden: this.getFormControl('hidden').value,
					type: this.getFormControl('type').value,
					file: this.getFormControl('file').value,
				};
			}

			this.dialogRef.close(response);
		}
	}
}
