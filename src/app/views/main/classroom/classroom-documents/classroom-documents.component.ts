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

	get documents(): Document[] {
		return this.ctx.classroom?.documents || [];
	}

	// TODO: Do a performance test later to see if this the filtering should be async or not
	get filteredDocuments(): Document[] {
		return this.documents.filter(document => {
			const filteredBySyllabus =
				this.markedSyllabus.length === 0 ||
				ArrayUtils.hasAllItems(
					document.syllabus.map(r => r.id),
					this.markedSyllabus,
				);

			const filteredByName = document.name.toLowerCase().includes(this.filter.toLowerCase());

			return filteredBySyllabus && filteredByName;
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
}
