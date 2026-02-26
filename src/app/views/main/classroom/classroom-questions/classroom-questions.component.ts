import { ComponentType } from '@angular/cdk/overlay';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import {
	ConfirmPopUpComponent,
	ConfirmPopUpData,
} from '../../../../components/pop-ups/confirm-pop-up/confirm-pop-up.component';
import { EditMultipleChoicePopUpComponent } from '../../../../components/pop-ups/questions/edit-multiple-choice-pop-up/edit-multiple-choice-pop-up.component';
import { EditMultipleSelectionPopUpComponent } from '../../../../components/pop-ups/questions/edit-multiple-selection-pop-up/edit-multiple-selection-pop-up.component';
import { EditOpenEndedPopUpComponent } from '../../../../components/pop-ups/questions/edit-open-ended-pop-up/edit-open-ended-pop-up.component';
import { EditTrueFalsePopUpComponent } from '../../../../components/pop-ups/questions/edit-true-false-pop-up/edit-true-false-pop-up.component';
import { QuestionCardComponent } from '../../../../components/question-card/question-card.component';
import { SubHeaderButton, SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { QuestionTypeEnum } from '../../../../enums/QuestionType.enum';
import { Document } from '../../../../models/Document';
import { Question } from '../../../../models/Question';
import { QuestionData } from '../../../../models/QuestionData';
import { Syllabus } from '../../../../models/Syllabus';
import { QuestionTypePipe } from '../../../../pipes/question-type.pipe';
import { ContextService } from '../../../../services/context.service';
import { DocumentService } from '../../../../services/document.service';
import { QuestionDataService } from '../../../../services/question-data.service';
import { ArrayUtils } from '../../../../utils/Array.utils';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'o-classroom-questions',
	imports: [
		LoadingComponent,
		SubHeaderComponent,
		MatMenuModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		SyllabusComponent,
		FormsModule,
		QuestionTypePipe,
		QuestionCardComponent,
	],
	templateUrl: './classroom-questions.component.html',
	styleUrl: './classroom-questions.component.scss',
})
export class ClassroomQuestionsComponent {
	ctx: ContextService = inject(ContextService);
	service: QuestionDataService = inject(QuestionDataService);
	documentService: DocumentService = inject(DocumentService);
	dialog: MatDialog = inject(MatDialog);
	route: ActivatedRoute = inject(ActivatedRoute);

	@ViewChild('menuTrigger') trigger!: MatMenuTrigger;

	isLoading: boolean = false;
	statementFilter: string = '';
	typeFilter: QuestionTypeEnum | null = null;
	types: QuestionTypeEnum[] = Object.values(QuestionTypeEnum);
	documentFilter: Document | null = null;
	documents: Document[] = [];
	markedSyllabus: Syllabus[] = [];

	ngOnInit() {
		this.getData().then(() => {
			this.route.queryParams.subscribe(params => {
				const documentQueryId: string | null = params['documentQueryId'] || null;
				this.documentFilter = this.documents.find(d => d.id === documentQueryId) || null;
				if (this.documentFilter && !this.documentFilter.questionsValidated) {
					this.validateDocumentQuestions(this.documentFilter.id);
				}
			});
		});
	}

	get questions(): QuestionData[] {
		return this.ctx.classroom?.questions || [];
	}

	get headerButtons(): SubHeaderButton[] {
		return [
			{
				text: 'Múltipla Escolha',
				icon: 'add',
				function: () => this.createQuestion(EditMultipleChoicePopUpComponent),
				highlighted: true,
			},
			{
				text: 'Múltipla Seleção',
				icon: 'add',
				function: () => this.createQuestion(EditMultipleSelectionPopUpComponent),
				highlighted: true,
			},
			{
				text: 'Verdadeiro ou Falso',
				icon: 'add',
				function: () => this.createQuestion(EditTrueFalsePopUpComponent),
				highlighted: true,
			},
			{
				text: 'Questão Aberta',
				icon: 'add',
				function: () => this.createQuestion(EditOpenEndedPopUpComponent),
				highlighted: true,
			},
		];
	}

	// TODO: Do a performance test later to see if this the filtering should be async or not
	get filteredQuestions(): QuestionData[] {
		return this.questions.filter(q => {
			const filteredBySyllabus =
				this.markedSyllabus.length === 0 ||
				(q.syllabus &&
					ArrayUtils.hasAllItems(
						q.syllabus.map(r => r.id),
						this.markedSyllabus.map(r => r.id),
					));

			const filteredByStatement = q.question.statement
				.toLowerCase()
				.trim()
				.includes(this.statementFilter.toLowerCase().trim());

			const filteredByType = !this.typeFilter || q.question.type === this.typeFilter;

			const filteredByDocument = !this.documentFilter || q.document?.id === this.documentFilter.id;

			return filteredBySyllabus && filteredByStatement && filteredByType && filteredByDocument;
		});
	}

	async getData() {
		await Promise.all([this.getQuestions(), this.getDocuments()]);
	}

	async getQuestions() {
		this.isLoading = true;
		await lastValueFrom(this.service.getByClassroom(this.ctx.classroom!.id))
			.then((qs: QuestionData[]) => {
				this.ctx.classroom!.questions = qs;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async getDocuments() {
		this.isLoading = true;
		await lastValueFrom(this.documentService.getQuestionDocumentsByClassroom(this.ctx.classroom!.id))
			.then((docs: Document[]) => {
				this.documents = docs;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	async validateDocumentQuestions(documentId: string) {
		this.isLoading = true;
		await lastValueFrom(this.documentService.validateDocumentQuestions(documentId)).finally(() => {
			this.isLoading = false;
		});
	}

	createQuestion(component: ComponentType<unknown>) {
		this.dialog
			.open(component, {
				minWidth: '1000px',
				data: { syllabus: [] },
			})
			.afterClosed()
			.subscribe(async (result: { question: Question; syllabus: Syllabus[] } | undefined) => {
				if (result) {
					this.isLoading = true;
					await lastValueFrom(
						this.service.create(
							result.question,
							this.ctx.classroom!.id,
							result.syllabus.map(s => s.id!),
						),
					)
						.then((q: QuestionData) => {
							this.ctx.classroom!.questions.unshift(q);
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

	async editQuestion(questionData: QuestionData) {
		let editionPopUp: any;
		switch (questionData.question.type) {
			case QuestionTypeEnum.MULTIPLE_CHOICE:
				editionPopUp = EditMultipleChoicePopUpComponent;
				break;
			case QuestionTypeEnum.MULTIPLE_SELECTION:
				editionPopUp = EditMultipleSelectionPopUpComponent;
				break;
			case QuestionTypeEnum.TRUE_FALSE:
				editionPopUp = EditTrueFalsePopUpComponent;
				break;
			case QuestionTypeEnum.OPEN_ENDED:
				editionPopUp = EditOpenEndedPopUpComponent;
				break;
		}
		this.dialog
			.open(editionPopUp, {
				data: {
					question: questionData.question,
					syllabus: questionData.syllabus,
				},
				minWidth: '1000px',
			})
			.afterClosed()
			.subscribe(async (result: { question: Question; syllabus: Syllabus[] } | undefined) => {
				if (result) {
					this.isLoading = true;
					await lastValueFrom(
						this.service.update(
							questionData.id,
							result.question,
							result.syllabus.map(s => s.id!),
						),
					)
						.then((updatedQuestionData: QuestionData) => {
							let questionInList: QuestionData = this.questions.find(
								q => q.id === updatedQuestionData.id,
							)!;
							questionInList.question = updatedQuestionData.question;
							questionInList.syllabus = updatedQuestionData.syllabus;
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}

	async deleteQuestion(question: QuestionData) {
		const data: ConfirmPopUpData = {
			title: 'Tem certeza que deseja excluir essa questão?',
			message: 'Essa ação não pode ser desfeita.',
			confirmButton: 'Excluir',
		};
		this.dialog
			.open(ConfirmPopUpComponent, { data })
			.afterClosed()
			.subscribe(async (result: boolean) => {
				if (result) {
					this.isLoading = true;
					await lastValueFrom(this.service.delete(question.id))
						.then(() => {
							this.ctx.classroom!.questions = this.ctx.classroom!.questions.filter(
								q => q.id !== question.id,
							);
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			});
	}
}
