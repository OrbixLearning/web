import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { TextButtonComponent } from '../../../../components/buttons/text-button/text-button.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import {
	DocumentPopUpComponent,
	UploadDocumentPopUpResponse,
} from '../../../../components/pop-ups/document-pop-up/document-pop-up.component';
import { SubHeaderButton, SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { SyllabusTagsComponent } from '../../../../components/syllabus-tags/syllabus-tags.component';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { DocumentAIUploadStatusEnum } from '../../../../enums/DocumentAIUploadStatus.enum';
import { DocumentTypeEnum } from '../../../../enums/DocumentType.enum';
import { Document } from '../../../../models/Document';
import { Syllabus } from '../../../../models/Syllabus';
import { DocumentTypePipe } from '../../../../pipes/document-type.pipe';
import { ClassroomService } from '../../../../services/classroom.service';
import { ContextService } from '../../../../services/context.service';
import { DocumentService } from '../../../../services/document.service';
import { ArrayUtils } from '../../../../utils/Array.utils';
import { download } from '../../../../utils/Download.util';

@Component({
	selector: 'o-classroom-documents',
	imports: [
		LoadingComponent,
		MatIconModule,
		MatButtonModule,
		RouterModule,
		MatFormFieldModule,
		SyllabusComponent,
		FormsModule,
		MatInputModule,
		SyllabusTagsComponent,
		SubHeaderComponent,
		TextButtonComponent,
		TooltipModule,
		DocumentTypePipe,
		MatSelectModule,
	],
	templateUrl: './classroom-documents.component.html',
	styleUrl: './classroom-documents.component.scss',
})
export class ClassroomDocumentsComponent {
	ctx: ContextService = inject(ContextService);
	service: DocumentService = inject(DocumentService);
	classroomService: ClassroomService = inject(ClassroomService);
	dialog: MatDialog = inject(MatDialog);
	router: Router = inject(Router);

	isLoading: boolean = false;
	filter: string = '';
	typeFilter: DocumentTypeEnum | null = null;
	types: DocumentTypeEnum[] = Object.values(DocumentTypeEnum);
	markedSyllabus: Syllabus[] = [];
	documentAIUploadStatusEnum = DocumentAIUploadStatusEnum;

	ngOnInit() {
		this.getData();
	}

	get documents(): Document[] {
		return this.ctx.classroom?.documents || [];
	}

	get headerButtons(): SubHeaderButton[] {
		let buttons: SubHeaderButton[] = [];
		if (this.ctx.isTeacher) {
			buttons.push({
				text: 'Adicionar documento',
				icon: 'add',
				function: () => this.uploadDocument(),
				highlighted: true,
			});
		}
		return buttons;
	}

	// TODO: Do a performance test later to see if this the filtering should be async or not
	get filteredDocuments(): Document[] {
		return this.documents
			.filter(d => {
				const filteredBySyllabus =
					this.markedSyllabus.length === 0 ||
					(d.syllabus &&
						ArrayUtils.hasAllItems(
							d.syllabus.map(r => r.id),
							this.markedSyllabus.map(r => r.id),
						));

				const filteredByName = d.name.toLowerCase().trim().includes(this.filter.toLowerCase().trim());

				const filteredByType = !this.typeFilter || d.type === this.typeFilter;

				return filteredBySyllabus && filteredByName && filteredByType;
			})
			.sort((a, b) => {
				const statusA =
					a.aiStatus === DocumentAIUploadStatusEnum.UPLOADING ||
					a.aiStatus === DocumentAIUploadStatusEnum.FAILED;
				const statusB =
					b.aiStatus === DocumentAIUploadStatusEnum.UPLOADING ||
					b.aiStatus === DocumentAIUploadStatusEnum.FAILED;
				if (!statusA && statusB) return 1;
				if (statusA && !statusB) return -1;
				return a.name.localeCompare(b.name);
			});
	}

	async getData() {
		this.isLoading = true;
		await lastValueFrom(this.service.getByClassroom(this.ctx.classroom!.id))
			.then((docs: Document[]) => {
				this.ctx.classroom!.documents = docs;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	uploadDocument() {
		this.dialog
			.open(DocumentPopUpComponent, {
				minWidth: '800px',
			})
			.afterClosed()
			.subscribe(async (response: UploadDocumentPopUpResponse | undefined) => {
				if (response) {
					this.isLoading = true;
					await lastValueFrom(
						this.service.uploadFile(
							response.name,
							response.syllabusIds,
							this.ctx.classroom!.id,
							response.feedAi,
							response.hidden,
							response.type,
							response.file,
						),
					)
						.then((document: Document) => {
							this.ctx.classroom!.documents.push(document);
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	markSyllabus(syllabus: Syllabus[]) {
		this.markedSyllabus = syllabus;
	}

	showValidateQuestionsButton(doc: Document): boolean {
		return (
			doc.aiStatus === DocumentAIUploadStatusEnum.UPLOADED &&
			doc.questionsValidated !== null &&
			(doc.type === DocumentTypeEnum.EXERCISE || doc.type === DocumentTypeEnum.PAST_EXAM) &&
			!doc.questionsValidated
		);
	}

	async downloadDocument(documentId: string, documentName: string) {
		this.isLoading = true;
		await lastValueFrom(this.service.getFile(documentId))
			.then((blob: Blob) => {
				download(blob, documentName);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async updateDocument(documentParam: Document) {
		this.dialog
			.open(DocumentPopUpComponent, {
				data: {
					document: documentParam,
				},
			})
			.afterClosed()
			.subscribe(async (documentResponse: Document | undefined) => {
				if (documentResponse) {
					this.isLoading = true;
					let syllabusIds: string[] = documentResponse.syllabus!.map(s => s.id!);
					await lastValueFrom(
						this.service.update(
							documentResponse.id,
							documentResponse.name,
							documentResponse.hidden,
							documentResponse.type,
							syllabusIds,
						),
					)
						.then((documentUpdated: Document) => {
							let documentInList: Document = this.documents.find(d => d.id === documentUpdated.id)!;
							documentInList = Object.assign(documentInList, documentUpdated);
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	async deleteDocument(documentId: string) {
		let data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja excluir este documento?',
			message: 'Esta ação não pode ser desfeita.',
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (confirmed: boolean) => {
				if (confirmed) {
					this.isLoading = true;
					await lastValueFrom(this.service.delete(documentId))
						.then(() => {
							this.ctx.classroom!.documents = this.ctx.classroom!.documents.filter(
								document => document.id !== documentId,
							);
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	async recallDocumentAI(document: Document) {
		this.isLoading = true;
		await lastValueFrom(this.service.recallAI(document.id))
			.then(async () => {
				await this.getData();
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	goToQuestionValidation(doc: Document) {
		this.router.navigate(['/i/' + this.ctx.institution?.id + '/c/' + this.ctx.classroom?.id + '/questions'], {
			queryParams: {
				documentQueryId: doc.id,
			},
		});
	}
}
