import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { QuestionTypeEnum } from '../../../enums/QuestionType.enum';
import { Document } from '../../../models/Document';
import { LearningPath } from '../../../models/LearningPath/LearningPath';
import { QuestionData } from '../../../models/QuestionData';
import { QuestionTypePipe } from '../../../pipes/question-type.pipe';
import { LoadingComponent } from '../../loading/loading.component';
import { QuestionCardComponent } from '../../question-card/question-card.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

@Component({
	selector: 'o-select-question-pop-up',
	imports: [
		LoadingComponent,
		PopUpHeaderComponent,
		MatDialogModule,
		QuestionCardComponent,
		MatSelectModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		QuestionTypePipe,
	],
	templateUrl: './select-question-pop-up.component.html',
	styleUrl: './select-question-pop-up.component.scss',
})
export class SelectQuestionPopUpComponent {
	data: { learningPath: LearningPath; questions: QuestionData[]; docs: Document[] } = inject(MAT_DIALOG_DATA);
	dialogRef: MatDialogRef<SelectQuestionPopUpComponent> = inject(MatDialogRef);

	isLoading: boolean = false;
	statementFilter: string = '';
	typeFilter: QuestionTypeEnum | null = null;
	types: QuestionTypeEnum[] = Object.values(QuestionTypeEnum);
	documentFilter: Document | null = null;

	get learningPath() {
		return this.data.learningPath;
	}

	get questions() {
		return this.data.questions;
	}

	get documents() {
		return this.data.docs;
	}

	// TODO: Do a performance test later to see if this the filtering should be async or not
	get filteredQuestions(): QuestionData[] {
		return this.questions.filter(q => {
			const filteredByStatement = q.question.statement
				.toLowerCase()
				.trim()
				.includes(this.statementFilter.toLowerCase().trim());

			const filteredByType = !this.typeFilter || q.question.type === this.typeFilter;

			const filteredByDocument = !this.documentFilter || q.document?.id === this.documentFilter.id;

			return filteredByStatement && filteredByType && filteredByDocument;
		});
	}

	selectQuestion(question: QuestionData) {
		this.dialogRef.close(question.question);
	}
}
