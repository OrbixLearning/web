import { Component, inject } from '@angular/core';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { SubHeaderButton, SubHeaderComponent } from '../../../../components/sub-header/sub-header.component';
import { ContextService } from '../../../../services/context.service';
import { QuestionDataService } from '../../../../services/question-data.service';
import { MatDialog } from '@angular/material/dialog';
import { QuestionData } from '../../../../models/QuestionData';
import { lastValueFrom } from 'rxjs';

@Component({
	selector: 'o-classroom-questions',
	imports: [LoadingComponent, SubHeaderComponent],
	templateUrl: './classroom-questions.component.html',
	styleUrl: './classroom-questions.component.scss',
})
export class ClassroomQuestionsComponent {
	ctx: ContextService = inject(ContextService);
	service: QuestionDataService = inject(QuestionDataService);
	dialog: MatDialog = inject(MatDialog);

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
				text: 'Criar questão',
				icon: 'add',
				function: () => this.create(),
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

	create() {}
}
