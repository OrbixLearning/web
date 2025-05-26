import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	UploadDocumentPopUpComponent,
	UploadDocumentPopUpResponse,
} from '../../../../components/pop-ups/upload-document-pop-up/upload-document-pop-up.component';
import { ContextService } from '../../../../services/context.service';
import { DocumentService } from '../../../../services/document.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { FormsModule } from '@angular/forms';
import { Document } from '../../../../models/Document';
import { Syllabus } from '../../../../models/Syllabus';
import { ArrayUtils } from '../../../../utils/Array.utils';
import { MatInputModule } from '@angular/material/input';
import { RenameDocumentPopUpComponent } from '../../../../components/pop-ups/rename-document-pop-up/rename-document-pop-up.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';

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
	],
	templateUrl: './classroom-documents.component.html',
	styleUrl: './classroom-documents.component.scss',
})
export class ClassroomDocumentsComponent {
	ctx: ContextService = inject(ContextService);
	service: DocumentService = inject(DocumentService);
	dialog: MatDialog = inject(MatDialog);

	isLoading: boolean = false;
	filter: string = '';
	markedSyllabus: Syllabus[] = [];

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
			.open(UploadDocumentPopUpComponent)
			.afterClosed()
			.subscribe(async (response: UploadDocumentPopUpResponse) => {
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
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = documentName;
				a.click();
				window.URL.revokeObjectURL(url);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async renameDocument(document: Document) {
		this.dialog
			.open(RenameDocumentPopUpComponent, {
				data: {
					name: document.name,
				},
			})
			.afterClosed()
			.subscribe(async (name: string | undefined) => {
				if (name) {
					this.isLoading = true;
					await lastValueFrom(this.service.rename(document.id, name))
						.then((document: Document) => {
							this.documents.find(d => d.id === document.id)!.name = document.name;
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
}
