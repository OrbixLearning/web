import { Component, inject, ViewChild } from '@angular/core';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { SubHeaderButton, SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { ContextService } from '../../../../services/context.service';
import { QuestionDataService } from '../../../../services/question-data.service';
import { MatDialog } from '@angular/material/dialog';
import { QuestionData } from '../../../../models/QuestionData';
import { lastValueFrom } from 'rxjs';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { QuestionTypeEnum } from '../../../../enums/QuestionType.enum';
import { EditMultipleChoicePopUpComponent } from '../../../../components/pop-ups/questions/edit-multiple-choice-pop-up/edit-multiple-choice-pop-up.component';
import { EditMultipleSelectionPopUpComponent } from '../../../../components/pop-ups/questions/edit-multiple-selection-pop-up/edit-multiple-selection-pop-up.component';
import { EditTrueFalsePopUpComponent } from '../../../../components/pop-ups/questions/edit-true-false-pop-up/edit-true-false-pop-up.component';
import { EditOpenEndedPopUpComponent } from '../../../../components/pop-ups/questions/edit-open-ended-pop-up/edit-open-ended-pop-up.component';
import { Syllabus } from '../../../../models/Syllabus';
import { Question } from '../../../../models/Question';

@Component({
	selector: 'o-classroom-questions',
	imports: [LoadingComponent, SubHeaderComponent, MatMenuModule],
	templateUrl: './classroom-questions.component.html',
	styleUrl: './classroom-questions.component.scss',
})
export class ClassroomQuestionsComponent {
	ctx: ContextService = inject(ContextService);
	service: QuestionDataService = inject(QuestionDataService);
	dialog: MatDialog = inject(MatDialog);

	@ViewChild('menuTrigger') trigger!: MatMenuTrigger;

	isLoading: boolean = false;
	filter: string = '';

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
				function: () => this.addMultipleChoiceQuestion(),
				highlighted: true,
			},
			{
				text: 'Múltipla Seleção',
				icon: 'add',
				function: () => this.addMultipleSelectionQuestion(),
				highlighted: true,
			},
			{
				text: 'Verdadeiro ou Falso',
				icon: 'add',
				function: () => this.addTrueFalseQuestion(),
				highlighted: true,
			},
			{
				text: 'Questão Aberta',
				icon: 'add',
				function: () => this.addOpenEndedQuestion(),
				highlighted: true,
			},
		];
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

	addMultipleChoiceQuestion() {
		this.dialog
			.open(EditMultipleChoicePopUpComponent, {
				minWidth: '600px',
				data: { syllabus: [] },
			})
			.afterClosed()
			.subscribe((result: { question: Question; syllabus: Syllabus[] } | undefined) => {
				if (result) {
					// TODO
				}
			});
	}

	addMultipleSelectionQuestion() {
		this.dialog
			.open(EditMultipleSelectionPopUpComponent, {
				minWidth: '600px',
				data: { syllabus: [] },
			})
			.afterClosed()
			.subscribe((result: { question: Question; syllabus: Syllabus[] } | undefined) => {
				if (result) {
					// TODO
				}
			});
	}

	addTrueFalseQuestion() {
		this.dialog
			.open(EditTrueFalsePopUpComponent, {
				minWidth: '600px',
				data: { syllabus: [] },
			})
			.afterClosed()
			.subscribe((result: { question: Question; syllabus: Syllabus[] } | undefined) => {
				if (result) {
					// TODO
				}
			});
	}

	addOpenEndedQuestion() {
		this.dialog
			.open(EditOpenEndedPopUpComponent, {
				minWidth: '600px',
				data: { syllabus: [] },
			})
			.afterClosed()
			.subscribe((result: { question: Question; syllabus: Syllabus[] } | undefined) => {
				if (result) {
					// TODO
				}
			});
	}
}
