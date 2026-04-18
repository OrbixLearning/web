import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { DocumentCardComponent } from '../../../../components/document-card/document-card.component';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	DocumentPopUpComponent,
	UploadDocumentPopUpResponse,
} from '../../../../components/pop-ups/document-pop-up/document-pop-up.component';
import {
	SuccessPopUpComponent,
	SuccessPopUpData,
} from '../../../../components/pop-ups/success-pop-up/success-pop-up.component';
import { SubHeaderButton, SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { DocumentAIUploadStatusEnum } from '../../../../enums/DocumentAIUploadStatus.enum';
import { DocumentTypeEnum } from '../../../../enums/DocumentType.enum';
import { Document } from '../../../../models/Document';
import { Syllabus } from '../../../../models/Syllabus';
import { DocumentTypePipe } from '../../../../pipes/document-type.pipe';
import { ContextService } from '../../../../services/context.service';
import { DocumentService } from '../../../../services/document.service';
import { TreeUtils } from '../../../../utils/Tree.utils';

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
		SubHeaderComponent,
		TooltipModule,
		DocumentTypePipe,
		MatSelectModule,
		DocumentCardComponent,
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
	typeFilter: DocumentTypeEnum | null = null;
	types: DocumentTypeEnum[] = Object.values(DocumentTypeEnum);
	markedSyllabus: Syllabus[] = [];

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
					(d.syllabus && TreeUtils.hasItemInCommon(this.markedSyllabus, d.syllabus, 'id', 'topics'));

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
				disableClose: true,
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
							if (
								document.type === DocumentTypeEnum.EXERCISE ||
								document.type === DocumentTypeEnum.PAST_EXAM
							) {
								const data: SuccessPopUpData = {
									title: 'O envio deste documento gerará questões automaticamente pela IA. Recomendamos fazer a verificação dessas questões. A IA pode cometer erros.',
								};
								this.dialog.open(SuccessPopUpComponent, { data });
							}
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
}
