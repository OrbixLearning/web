import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import {
	DocumentPopUpComponent,
	UploadDocumentPopUpResponse,
} from '../../../../components/pop-ups/document-pop-up/document-pop-up.component';
import { SyllabusTagsComponent } from '../../../../components/syllabus-tags/syllabus-tags.component';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { Document } from '../../../../models/Document';
import { Syllabus } from '../../../../models/Syllabus';
import { ContextService } from '../../../../services/context.service';
import { DocumentService } from '../../../../services/document.service';
import { ArrayUtils } from '../../../../utils/Array.utils';
import { ClassroomService } from '../../../../services/classroom.service';
import { download } from '../../../../utils/Download.util';
import { Classroom } from '../../../../models/Classroom';
import { DocumentAIUploadStatusEnum } from '../../../../enums/DocumentAIUploadStatus.enum';

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
	],
	templateUrl: './classroom-documents.component.html',
	styleUrl: './classroom-documents.component.scss',
})
export class ClassroomDocumentsComponent {
	ctx: ContextService = inject(ContextService);
	service: DocumentService = inject(DocumentService);
	classroomService: ClassroomService = inject(ClassroomService);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	filter: string = '';
	markedSyllabus: Syllabus[] = [];
	documentAIUploadStatusEnum = DocumentAIUploadStatusEnum;

	ngOnInit() {
		this.getData();
	}

	get documents(): Document[] {
		return this.ctx.classroom?.documents || [];
	}

	// TODO: Do a performance test later to see if this the filtering should be async or not
	get filteredDocuments(): Document[] {
		return this.documents.filter(d => {
			const filteredBySyllabus =
				this.markedSyllabus.length === 0 ||
				(d.syllabus &&
					ArrayUtils.hasAllItems(
						d.syllabus.map(r => r.id),
						this.markedSyllabus.map(r => r.id),
					));

			const filteredByName = d.name.toLowerCase().includes(this.filter.toLowerCase());

			return filteredBySyllabus && filteredByName;
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
			.open(DocumentPopUpComponent)
			.afterClosed()
			.subscribe(async (response: UploadDocumentPopUpResponse | undefined) => {
				if (response) {
					this.isLoading = true;
					await lastValueFrom(
						this.service.uploadFile(
							response.name,
							response.syllabusIds,
							this.ctx.classroom!.id,
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
					await lastValueFrom(this.service.update(documentResponse.id, documentResponse.name, syllabusIds))
						.then((documentUpdated: Document) => {
							let documentInList: Document = this.documents.find(d => d.id === documentUpdated.id)!;
							documentInList.name = documentUpdated.name;
							documentInList.syllabus = documentUpdated.syllabus;
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

	async downloadSyllabusDocument() {
		this.isLoading = true;
		const documentName = 'Definição Curricular - ' + this.ctx.classroom!.name;
		await lastValueFrom(this.classroomService.getSyllabusDocument(this.ctx.classroom!.id, documentName))
			.then((blob: Blob) => {
				download(blob, documentName + '.pdf');
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async deleteSyllabusDocument() {
		let data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja excluir este documento?',
			message: 'A ementa não será desfeita.',
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (confirmed: boolean) => {
				if (confirmed) {
					this.isLoading = true;
					await lastValueFrom(this.classroomService.deleteSyllabusDocument(this.ctx.classroom!.id))
						.then((c: Classroom) => {
							this.ctx.classroom = c;
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}
}
