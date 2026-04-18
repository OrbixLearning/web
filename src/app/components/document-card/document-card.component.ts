import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { DocumentAIUploadStatusEnum } from '../../enums/DocumentAIUploadStatus.enum';
import { DocumentTypeEnum } from '../../enums/DocumentType.enum';
import { Document } from '../../models/Document';
import { DocumentTypePipe } from '../../pipes/document-type.pipe';
import { ContextService } from '../../services/context.service';
import { DocumentService } from '../../services/document.service';
import { download } from '../../utils/Download.util';
import { TextButtonComponent } from '../buttons/text-button/text-button.component';
import { LoadingComponent } from '../loading/loading.component';
import { ConfirmPopUpComponent, ConfirmPopUpData } from '../pop-ups/confirm-pop-up/confirm-pop-up.component';
import { DocumentPopUpComponent } from '../pop-ups/document-pop-up/document-pop-up.component';
import { SyllabusTagsComponent } from '../syllabus-tags/syllabus-tags.component';

@Component({
	selector: 'o-document-card',
	imports: [
		DocumentTypePipe,
		MatIconModule,
		SyllabusTagsComponent,
		TextButtonComponent,
		LoadingComponent,
		MatButtonModule,
		TooltipModule,
	],
	templateUrl: './document-card.component.html',
	styleUrl: './document-card.component.scss',
})
export class DocumentCardComponent {
	ctx: ContextService = inject(ContextService);
	service: DocumentService = inject(DocumentService);
	dialog: MatDialog = inject(MatDialog);
	router: Router = inject(Router);

	@Input() document!: Document;
	@Input() showActions: boolean = true;
	@Input() showSyllabus: boolean = true;
	@Output() aiRecalled: EventEmitter<void> = new EventEmitter<void>();

	isLoading: boolean = false;
	documentAIUploadStatusEnum = DocumentAIUploadStatusEnum;

	get showValidateQuestionsButton(): boolean {
		return (
			this.document.aiStatus === DocumentAIUploadStatusEnum.UPLOADED &&
			this.document.questionsValidated !== null &&
			(this.document.type === DocumentTypeEnum.EXERCISE || this.document.type === DocumentTypeEnum.PAST_EXAM) &&
			!this.document.questionsValidated
		);
	}

	async downloadDocument() {
		this.isLoading = true;
		await lastValueFrom(this.service.getFile(this.document.id))
			.then((blob: Blob) => {
				download(blob, this.document.name);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async updateDocument() {
		this.dialog
			.open(DocumentPopUpComponent, {
				data: {
					document: this.document,
				},
				disableClose: true,
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
							this.document = Object.assign(this.document, documentUpdated);
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	async deleteDocument() {
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
					await lastValueFrom(this.service.delete(this.document.id))
						.then(() => {
							this.ctx.classroom!.documents = this.ctx.classroom!.documents.filter(
								document => document.id !== this.document.id,
							);
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	async recallDocumentAI() {
		this.isLoading = true;
		await lastValueFrom(this.service.recallAI(this.document.id))
			.then(() => {
				this.aiRecalled.emit();
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	goToQuestionValidation() {
		this.router.navigate(['/i/' + this.ctx.institution?.id + '/c/' + this.ctx.classroom?.id + '/questions'], {
			queryParams: {
				documentQueryId: this.document.id,
			},
		});
	}
}
