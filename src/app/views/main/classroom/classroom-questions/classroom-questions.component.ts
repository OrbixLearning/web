import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { lastValueFrom } from 'rxjs';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { EditMultipleChoicePopUpComponent } from '../../../../components/pop-ups/questions/edit-multiple-choice-pop-up/edit-multiple-choice-pop-up.component';
import { EditMultipleSelectionPopUpComponent } from '../../../../components/pop-ups/questions/edit-multiple-selection-pop-up/edit-multiple-selection-pop-up.component';
import { EditOpenEndedPopUpComponent } from '../../../../components/pop-ups/questions/edit-open-ended-pop-up/edit-open-ended-pop-up.component';
import { EditTrueFalsePopUpComponent } from '../../../../components/pop-ups/questions/edit-true-false-pop-up/edit-true-false-pop-up.component';
import { SubHeaderButton, SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { Question } from '../../../../models/Question';
import { QuestionData } from '../../../../models/QuestionData';
import { Syllabus } from '../../../../models/Syllabus';
import { ContextService } from '../../../../services/context.service';
import { QuestionDataService } from '../../../../services/question-data.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { SyllabusComponent } from '../../../../components/syllabus/syllabus.component';
import { QuestionTypeEnum } from '../../../../enums/QuestionType.enum';
import { FormsModule } from '@angular/forms';
import { QuestionTypePipe } from '../../../../pipes/question-type.pipe';
import { ArrayUtils } from '../../../../utils/Array.utils';

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
	],
	templateUrl: './classroom-questions.component.html',
	styleUrl: './classroom-questions.component.scss',
})
export class ClassroomQuestionsComponent {
	ctx: ContextService = inject(ContextService);
	service: QuestionDataService = inject(QuestionDataService);
	dialog: MatDialog = inject(MatDialog);

	@ViewChild('menuTrigger') trigger!: MatMenuTrigger;

	isLoading: boolean = false;
	statementFilter: string = '';
	typeFilter: QuestionTypeEnum | null = null;
	types: QuestionTypeEnum[] = Object.values(QuestionTypeEnum);
	markedSyllabus: Syllabus[] = [];

	ngOnInit() {
		this.getData();
	}

	get questions(): QuestionData[] {
		return this.ctx.classroom?.questions || [];
	}

	get headerButtons(): SubHeaderButton[] {
		return [
			{
				text: 'Múltipla Escolha',
				icon: 'add',
				function: () => this.createMultipleChoiceQuestion(),
				highlighted: true,
			},
			{
				text: 'Múltipla Seleção',
				icon: 'add',
				function: () => this.createMultipleSelectionQuestion(),
				highlighted: true,
			},
			{
				text: 'Verdadeiro ou Falso',
				icon: 'add',
				function: () => this.createTrueFalseQuestion(),
				highlighted: true,
			},
			{
				text: 'Questão Aberta',
				icon: 'add',
				function: () => this.createOpenEndedQuestion(),
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

			return filteredBySyllabus && filteredByStatement && filteredByType;
		});
	}

	async getData() {
		this.isLoading = true;
		await lastValueFrom(this.service.getByClassroom(this.ctx.classroom!.id))
			.then((qs: QuestionData[]) => {
				this.ctx.classroom!.questions = qs;
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	createMultipleChoiceQuestion() {
		this.dialog
			.open(EditMultipleChoicePopUpComponent, {
				minWidth: '1000px',
				data: { syllabus: [] },
			})
			.afterClosed()
			.subscribe((result: { question: Question; syllabus: Syllabus[] } | undefined) => {
				if (result) {
					// TODO
				}
			});
	}

	createMultipleSelectionQuestion() {
		this.dialog
			.open(EditMultipleSelectionPopUpComponent, {
				minWidth: '1000px',
				data: { syllabus: [] },
			})
			.afterClosed()
			.subscribe((result: { question: Question; syllabus: Syllabus[] } | undefined) => {
				if (result) {
					// TODO
				}
			});
	}

	createTrueFalseQuestion() {
		this.dialog
			.open(EditTrueFalsePopUpComponent, {
				minWidth: '1000px',
				data: { syllabus: [] },
			})
			.afterClosed()
			.subscribe((result: { question: Question; syllabus: Syllabus[] } | undefined) => {
				if (result) {
					// TODO
				}
			});
	}

	createOpenEndedQuestion() {
		this.dialog
			.open(EditOpenEndedPopUpComponent, {
				minWidth: '1000px',
				data: { syllabus: [] },
			})
			.afterClosed()
			.subscribe((result: { question: Question; syllabus: Syllabus[] } | undefined) => {
				if (result) {
					// TODO
				}
			});
	}

	markSyllabus(syllabus: Syllabus[]) {
		this.markedSyllabus = syllabus;
	}
}
